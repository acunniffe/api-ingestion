const shell = require('shelljs')
const path = require('path')
const waitPort = require('wait-port');
const {spawn} = require('child_process')

const runningEnvs = []

function buildEnv(name, dir, testPort) {
	//docker build . -t test/node-express
	//docker run -p 49160:4000 -d

	const cwd = path.join(__dirname, dir)
	const startScript = path.join(__dirname, dir, 'start.sh')

	return new Promise((resolve, reject) => {
		shell.chmod('+x', startScript);
		const subprocess = spawn('sh', ['start.sh'], {cwd, env: {...process.env, OPTIC_SERVER_LISTENING: true}})

		subprocess.on('error', (err) => {
			console.log('Failed to start subprocess.');
			console.log(err);
		})

		waitPort({host: 'localhost', port: testPort, output: 'silent'})
			.then((open) => {
				if (open) {
					runningEnvs.push(subprocess)
					setTimeout(() => resolve({name, dir, testPort}), 3000)
				} else {
					reject('port did not open')
				}
			})

	})

}

function killAll() {
	runningEnvs.forEach(proc => proc.kill('SIGINT'))
}

module.exports = {buildEnv, killAll}
