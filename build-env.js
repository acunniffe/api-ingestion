const path = require('path');
const waitPort = require('wait-port');
const {exec} = require('child_process');
const ip = require('ip');
const debug = require('debug');

const logger = debug('optic');

const hostIp = ip.address();
const globalLog = require('global-request-logger');
globalLog.initialize();

globalLog.on('success', function (request, response) {
	console.log('SUCCESS');
	console.log('Request', request);
	console.log('Response', response);
});

globalLog.on('error', function (request, response) {
	console.log('ERROR');
	console.log('Request', request);
	console.log('Response', response);
});

function buildEnv(name, dir, testPort) {
	const cwd = path.join(__dirname, dir);
	const containerName = `test/${name}`;
	// console.log(cwd)
	// console.log('Building docker for '+ containerName)
	return new Promise((resolve, reject) => {
		exec(`docker build . -t "${containerName}"`, {cwd}, (err, stdout) => {
			logger(err);
			logger(stdout);

			if (err) {
				return reject(err);
			}

			exec(`docker run -p ${testPort}:4000 --add-host=testhost:${hostIp} -d ${containerName}`, {cwd}, (err, stdout) => {
				logger('Container ID ' + stdout);
				waitPort({host: 'localhost', port: testPort, output: 'silent'})
					.then((open) => {
						if (open) {
							logger('port open, waiting for server to start');
							setTimeout(() => resolve({name, dir, testPort}), 10000);
						} else {
							reject('port did not open');
						}
					});

			});

		});

	});
}

module.exports = {buildEnv};
