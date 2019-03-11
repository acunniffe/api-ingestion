const assert = require('assert')
const sharedTests = require('./shared-tests')
const enviroments = require('./enviroments')
const {exec} = require('child_process')

const {killAll} = require('../build-env')

describe('fixtures collect expected observations', () => {

	after(() => {
		killAll()
	})

	const dockerEnvs = enviroments()
	const getEnv = (key) => dockerEnvs.then((envs) => envs[key])

	// describe('scala-akka_http', () => {
	// 	sharedTests.sharedObservationsTest(getEnv('scala-akka_http'))
	// })
	//
	// describe('node-express', () => {
	// 	sharedTests.sharedObservationsTest(getEnv('node-express'))
	// })

	describe('ruby-rack', () => {
		sharedTests.sharedObservationsTest(getEnv('ruby-rack'))
	})
	// sharedTests.sharedObservationsTest(getEnv('scala-akka-http'))
	// sharedTests.sharedObservationsTest(getEnv('ruby-rails'))
	// sharedTests.sharedObservationsTest(getEnv('python-flask'))

})
