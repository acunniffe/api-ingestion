const request = require('request')
const express = require('express')

const opticWatching = process.env['OPTIC_SERVER_LISTENING']

const host = process.env['OPTIC_SERVER_HOST'] || 'localhost'

const opticRequestLoggingServer = `http://${host}:30334`
const opticResponseLoggingServer = `http://${host}:30335`

module.exports = function withOptic(app) {

	if (opticWatching) {
		const documentingApp = express()
		documentingApp.use((req, res, next) => {

			let oldWrite = res.write,
				oldEnd = res.end;
			let chunks = [];

			res.write = function (chunk) {
				chunks.push(Buffer.from(chunk));
				oldWrite.apply(res, arguments);
			};

			res.end = function (chunk) {
				if (chunk)
					chunks.push(Buffer.from(chunk));
				oldEnd.apply(res, arguments);
			};

			let requestBody = []
			req.on('data', function (chunk) {
				requestBody += chunk
			});

			res.on('finish', () => {
				request({
					baseUrl: opticRequestLoggingServer,
					uri: req.url,
					method: req.method,
					headers: req.headers,
					body: (Array.isArray(requestBody)) ? requestBody.join('') : requestBody
				}, (err, response, body) => {

					if (!err) {
						const statusCode = res.statusCode
						const interactionId = (body)
						const url = `/interactions/${interactionId}/status/${statusCode.toString()}`
						const headers = res.header()._headers
						const responseBody = Buffer.concat(chunks).toString('utf8')
						request.post({baseUrl: opticResponseLoggingServer, uri: url, headers, body: responseBody})
					}
				})

			})
			next()
		})

		documentingApp.use(app)
		return documentingApp
	}
	return app
}
