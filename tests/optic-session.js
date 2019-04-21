const {LoggingServer} = require('@useoptic/core/build/src/logging-server');
const util = require('util');
const debug = require('debug');
const logger = debug('optic');

module.exports = (block, callback) => {

	const loggingServer = new LoggingServer();

	const samples = [];

	loggingServer.on('sample', (s) => {
		logger('sample');
		logger(util.inspect(s, {colors: true, depth: 7}));
		samples.push(s);
	});

	loggingServer.start({
		requestLoggingServerPort: 30334,
		responseLoggingServerPort: 30335,
	})
		.then(() => {
			return new Promise((resolve, reject) => {
				logger('running session task');
				block(resolve);
			});
		})
		.then(() => {
			logger('waiting to stop');
			setTimeout(() => {
				logger('stopping');
				loggingServer.stop();
				logger('samples');
				logger(util.inspect(samples, {colors: true, depth: 7}));
				callback(samples);
			}, 300);
		})
		.catch(e => {
			console.error(e);
			throw e;
		});

};
