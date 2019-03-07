const assert = require('assert')
const sharedTests = require('./shared-tests')
const enviroments = require('./enviroments')
const {exec} = require('child_process')

describe('fixtures collect expected observations', () => {

	const dockerEnvs = enviroments()
	const getEnv = (key) => dockerEnvs.then((envs) => envs[key])

	describe('node-express', () => {
		sharedTests.sharedObservationsTest(getEnv('node-express'))
	})
	// sharedTests.sharedObservationsTest(getEnv('scala-akka-http'))
	// sharedTests.sharedObservationsTest(getEnv('ruby-rails'))
	// sharedTests.sharedObservationsTest(getEnv('python-flask'))

})
