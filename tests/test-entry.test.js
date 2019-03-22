const assert = require('assert');
const sharedTests = require('./shared-tests');
const enviroments = require('./enviroments');
const manifest = require('../manifest')
const dockerEnvs = enviroments();
const getEnv = (key) => dockerEnvs.then((envs) => envs[key]())



Object.keys(manifest).forEach(env => {
	describe(env, function() {
		sharedTests.sharedObservationsTest(getEnv(env))
	})
})
