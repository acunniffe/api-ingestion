const shell = require('shelljs')
const path = require('path')
const waitPort = require('wait-port');
const {spawn, exec} = require('child_process')
const ip = require('ip')

const runningEnvs = []
const hostIp = ip.address()


function buildEnv(name, dir, testPort) {
	//docker build . -t test/node-express
	//docker run -p 49160:4000 -d

	const cwd = path.join(__dirname, dir)
	const dockerfile = path.join(__dirname, dir, 'Dockerfile')
	const containerName = `test/${name}`

	// console.log('Building docker for '+ containerName)
	return new Promise((resolve, reject) => {
		exec(`docker build . -t ${containerName}`, {cwd}, (err, stdout) => {

			// console.log(err)
			// console.log(stdout)

			// if (!err) {console.log('Starting docker for '+ containerName)}

			exec(`docker run -p ${testPort}:4000 --add-host=testhost:${hostIp} -d ${containerName}`, {cwd}, (err, stdout) => {
				// console.log(stdout)
				waitPort({host: 'localhost', port: testPort, output: 'silent'})
					.then((open) => {
						if (open) {
							setTimeout(() => resolve({name, dir, testPort}), 5000)
						} else {
							reject('port did not open')
						}
					})

			})

		})

	})
}

module.exports = {buildEnv}
