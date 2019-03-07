const {exec} = require('child_process')
const path = require('path')
const waitPort = require('wait-port');


function buildEnv(name, dir, testPort) {
	//docker build . -t test/node-express
	//docker run -p 49160:4000 -d

	const dockerFileDir = path.join(__dirname, dir)
	const containerName = 'test/' + name

	return new Promise((resolve, reject) => {

		exec('docker build . -t ' + containerName, {cwd: dockerFileDir}, (err, stdout, stderr) => {
			// console.log('Building docker for ' + name)
			if (err) return reject(err)

			exec('ipconfig getifaddr en0', (err, stdout) => {
				console.log(stdout.trim())

				exec(`docker run -p ${testPort}:4000 --add-host="localhost:host.docker.internal" -d ${containerName}`, {cwd: dockerFileDir}, (err, stdout, stderr) => {
					if (err) return reject(err)

					waitPort({host: 'localhost', port: testPort, output: 'silent'})
						.then((open) => {
							if (open) {

								setTimeout(() => resolve({name, dir, testPort}), 3000)
							} else {
								reject('port did not open')
							}
						})

				})

			})

		})

	})


}

module.exports = buildEnv
