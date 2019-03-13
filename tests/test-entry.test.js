const assert = require('assert')
const sharedTests = require('./shared-tests')
const enviroments = require('./enviroments')

describe('fixtures collect expected observations', () => {


	const dockerEnvs = enviroments()
	const getEnv = (key) => dockerEnvs.then((envs) => envs[key]())

	describe('node-express', () => {
		sharedTests.sharedObservationsTest(getEnv('node-express'))
	})

	describe('ruby-rack', () => {
		sharedTests.sharedObservationsTest(getEnv('ruby-rack'))
	})

	describe('scala-akka_http', () => {
		sharedTests.sharedObservationsTest(getEnv('scala-akka_http'))
	})


})
