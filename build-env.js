const shell = require('shelljs')
const path = require('path')
const waitOn = require('wait-on');
const {exec} = require('child_process')
const ip = require('ip')

const runningEnvs = []
const hostIp = ip.address()


function buildEnv(name, dir, testPort) {
	//docker build . -t test/node-express
	//docker run -p 49160:4000 -d

	const cwd = path.join(__dirname, dir)
	const dockerfile = path.join(__dirname, dir, 'Dockerfile')
	const containerName = `test/${name}`
	// console.log(cwd)
	// console.log('Building docker for '+ containerName)
	return new Promise((resolve, reject) => {
		exec(`docker build . -t "${containerName}"`, {cwd}, (err, stdout) => {
			// console.log(err)
			// console.log(stdout)

			// if (!err) {console.log('Starting docker for '+ containerName)}

			exec(`docker run -p ${testPort}:4000 --add-host=testhost:${hostIp} -d ${containerName}`, {cwd}, (err, stdout) => {
				if (err) {
					console.error(err);
				}
				console.log(stdout)
				console.log(`waiting on localhost:${testPort}`)
				waitOn({
					resources: [
						`tcp:${testPort}`
					],
					delay: 1000,
					interval: 1000,
					window: 1000,
					timeout: 30000
				})
					.then(() => {
						setTimeout(() => resolve({name, dir, testPort}), 10000)
					})
					.catch((err) => {
						console.error(err);
						reject('timed out waiting for server')
					})

			})

		})

	})
}

module.exports = {buildEnv}
