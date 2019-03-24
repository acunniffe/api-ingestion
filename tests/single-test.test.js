const assert = require('assert');
const {sharedObservationsTest} = require('./shared-tests');
const {echoServerImplementationTests} = require('./shared-echo-server-tests');
const enviroments = require('./enviroments');
const manifest = require('../manifest')
const dockerEnvs = enviroments();
const getEnv = (key) => dockerEnvs.then((envs) => envs[key]())

const sdkId = process.env.npm_config_sdk_id;
if (sdkId) {
	console.log('Testing ' + sdkId);
	([sdkId]).forEach(env => {
		describe(env, function () {
			const testEnv = getEnv(env)
			// sharedObservationsTest(testEnv)
			echoServerImplementationTests(testEnv)
		})
	})
}
