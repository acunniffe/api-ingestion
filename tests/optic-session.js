const {LoggingServer} = require('@useoptic/core/build/src/logging-server');
const util = require('util');

module.exports = (block, callback) => {

	const loggingServer = new LoggingServer();

	const samples = [];

	loggingServer.on('sample', (s) => {
		console.log('sample');
		console.log(util.inspect(s, {colors: true, depth: 7}));
		samples.push(s);
	});

	loggingServer.start({
		requestLoggingServerPort: 30334,
		responseLoggingServerPort: 30335,
	})
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('running session task')
				block(resolve);
			});
		})
		.then(() => {
			console.log('waiting to stop')
			setTimeout(() => {
				console.log('stopping')
				loggingServer.stop();
				console.log('samples');
				console.log(util.inspect(samples, {colors: true, depth: 7}));
				callback(samples);
			}, 3000);
		})
		.catch(e => {
			console.error(e);
			throw e;
		});

};
