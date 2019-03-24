const assert = require('assert');
const sharedTests = require('./shared-tests');
const enviroments = require('./enviroments');
const manifest = require('../manifest')
const dockerEnvs = enviroments();
const getEnv = (key) => dockerEnvs.then((envs) => envs[key]())

const sdkId = process.env.npm_config_sdk_id;
console.log('Testing '+ sdkId);

([sdkId]).forEach(env => {
	describe(env, function() {
		sharedTests.sharedObservationsTest(getEnv(env))
	})
})
