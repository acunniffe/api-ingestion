const {exec} = require('child_process')
const buildEnv = require('../build-env')
module.exports = function setupEnvs() {
	return new Promise((resolve, reject) => {
		exec('docker kill $(docker ps -q)', () => {
			resolve({
				'node-express': buildEnv('node-express', '/subjects/node/express', 50001)
			})
		})
	})
}
