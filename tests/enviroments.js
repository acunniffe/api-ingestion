const {exec} = require('child_process')
const {buildEnv} = require('../build-env')

module.exports = function setupEnvs() {
	return new Promise((resolve, reject) => {
		exec('docker stop $(docker ps -a -q)', (err, stdout) => {
			resolve({
				'node-express': buildEnv('node-express', '/subjects/node/express', 50001),
				'scala-akka_http': buildEnv('scala-akka_http', '/subjects/scala/akka_http', 50002),
				'ruby-rack': buildEnv('ruby-rack', '/subjects/ruby/rack',50003)
			})
		})

	})

}
