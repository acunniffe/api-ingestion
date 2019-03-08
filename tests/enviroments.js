const {exec} = require('child_process')
const {buildEnv} = require('../build-env')
const killPort = require('kill-port')

const ports = [
	50001
]

module.exports = function setupEnvs() {
	return new Promise((resolve, reject) => {
		Promise.all(ports.map(p => killPort(p))).then(() => {
			resolve({
				'node-express': buildEnv('node-express', '/subjects/node/express', ports[0])
			})
		})

	})
}
