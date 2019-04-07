const opticIsListening = !!process.env.OPTIC_SERVER_LISTENING;
const host = process.env.OPTIC_SERVER_HOST;

const fetch = require('node-fetch');

function on(target, event, handler) {
	target.on(event, handler);
	return function () {
		target.removeListener(event, handler);
	};
}

function addHooks(req, res) {
	if (!opticIsListening) {
		return;
	}

	const cleanup = () => {
		cleanups.forEach(cleanup => cleanup());
	};

	const logFn = () => {
		cleanup();
		/*console.log(req.url);
		console.log(req.headers);
		console.log(res.getHeaders());*/
		const url = `http://${host}:30334${req.url}`;
		fetch(url, {
			method: req.method,
			headers: req.headers,
			body: req.method === 'GET' ? null : requestBody
		})
			.then(logRequestResponse => {
				if (logRequestResponse.ok) {
					return logRequestResponse.text()
						.then(logRequestResponseBody => {
							return {
								interactionId: logRequestResponseBody
							};
						});
				}
				throw new Error(`unexpected failure response from Optic logging server`);
			})
			.then(({interactionId}) => {
				const url = `http://${host}:30335/interactions/${interactionId}/status/${res.statusCode}`;
				fetch(url, {
					method: 'POST',
					headers: res.getHeaders(),
					body: responseBody
				})
					.catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	};

	const abortFn = () => {
		cleanup();
	};

	const errorFn = () => {
		cleanup();
	};

	let requestBody = '';
	let responseBody = '';
	const cleanups = [
		on(req, 'data', chunk => {
			requestBody += chunk.toString();
		}),
		on(req, 'end', () => {
			console.log({requestBody});
		}),
		on(req, 'data', chunk => {
			responseBody += chunk.toString();
		}),
		on(req, 'end', () => {
			console.log({responseBody});
		}),
		on(res, 'finish', logFn),
		on(res, 'close', abortFn),
		on(res, 'error', errorFn)
	];

}

module.exports = {
	addHooks
};