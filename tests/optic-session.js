const LoggingServer = require('@useoptic/core/build/src/logging-server').LoggingServer

module.exports = (block, callback) => {

	const loggingServer = new LoggingServer()

	const samples = []

	loggingServer.on('sample', (s) => samples.push(s).bind(this));

	loggingServer.start({
		requestLoggingServerPort: 30334,
		responseLoggingServerPort: 30335,
	})
	.then(() => new Promise((resolve, reject) => block(resolve)))
	.then(() => {
		loggingServer.stop()
		console.log(samples)
		callback()
	})

}
