const assert = require('assert');
const {echoServerImplementationTests} = require('./shared-echo-server-tests');
const {sharedObservationsTest} = require('./shared-tests');
const enviroments = require('./enviroments');
const manifest = require('../manifest')
const dockerEnvs = enviroments();
const getEnv = (key) => dockerEnvs.then((envs) => envs[key]())

Object.keys(manifest).forEach(env => {
	describe(env, function() {
		const testEnv = getEnv(env)
		sharedObservationsTest(testEnv)
		// echoServerImplementationTests(testEnv)
	})
})
