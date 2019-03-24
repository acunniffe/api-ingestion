const {exec} = require('child_process');
const {buildEnv} = require('../build-env');
const manifest = require('../manifest.json');

module.exports = function setupEnvs() {
	return new Promise((resolve, reject) => {
		exec('docker stop $(docker ps -a -q)', (err, stdout) => {
			const envs = {};
			Object.entries(manifest).forEach((i, index) => {
				const key = i[0];
				const info = i[1];
				envs[key] = () => buildEnv(key, info.test, 5001 + index);
			});

			resolve(envs);
		});
	});
};
