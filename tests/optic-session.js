const LoggingServer = require('@useoptic/core/build/src/logging-server').LoggingServer
const {exec} = require('child_process')

module.exports = (block, callback) => {

	const loggingServer = new LoggingServer()

	const samples = []

	loggingServer.on('sample', (s) => {
		samples.push(s)
	});

	loggingServer.start({
		requestLoggingServerPort: 30334,
		responseLoggingServerPort: 30335,
	})
		.then(() => {
			exec('ping localhost:30334')
			return new Promise((resolve, reject) => block(resolve))
		})
		.then(() => {
			setTimeout(() => {
				loggingServer.stop()
				callback(samples)
			}, 300)
		})

}
