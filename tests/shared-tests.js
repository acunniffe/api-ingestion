const assert = require('assert')
const request = require('request')
const session = require('./optic-session')

exports.sharedObservationsTest = (p) =>  {

	const assertValidEnv = (callback) => {
		p.then((env) => {
			assert(true)
			callback(request.defaults({baseUrl: `http://localhost:${env.testPort}/`}), env)
		})
		p.catch(() => {
			assert(false)
		})
	}


	it('could start test server', (done) =>  assertValidEnv(() => {
			assert(true)
			done()
	}))

	describe('logging service handles query parameters', () => {

		it('when none', (done) =>  assertValidEnv((r) => {

			session((done1) => {
				r.get('/test-endpoint', {qs: {}}, (err, response, body) => {
					console.log(body)
					done1()
				})
			}, () => {
				console.log('reached callback')
				done()
			})

		}))

	})


};
