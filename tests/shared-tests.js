const assert = require('assert')
const request = require('request')
const session = require('./optic-session')
const {simpleJson, longJson} = require('./test-bodies')

exports.sharedObservationsTest = (p) => {

	const assertValidEnv = (callback) => {
		p.then((env) => {
			assert(true)
			callback(request.defaults({baseUrl: `http://localhost:${env.testPort}/`}), env)
		})
		p.catch(() => {
			assert(false)
		})
	}


	it('could start test server', (done) => assertValidEnv(() => {
		assert(true)
		done()
	}))

	describe('logging service handles request method', () => {

		const testMethod = (method, done, r) => {
			session((done1) => r('/test-endpoint', {method: method}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(request.method === method.toUpperCase())
				done()
			})
		}

		it('get', (done) => assertValidEnv((r) => testMethod('get', done, r)))
		it('post', (done) => assertValidEnv((r) => testMethod('post', done, r)))
		it('put', (done) => assertValidEnv((r) => testMethod('put', done, r)))
		it('delete', (done) => assertValidEnv((r) => testMethod('delete', done, r)))
		it('patch', (done) => assertValidEnv((r) => testMethod('patch', done, r)))
		it.skip('head', (done) => assertValidEnv((r) => testMethod('head', done, r)))
		it('options', (done) => assertValidEnv((r) => testMethod('options', done, r)))

	})

	describe('logging service handles query parameters', () => {

		it('finds no query parameters when none', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {qs: {}}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(Object.entries(request.queryParameters).length === 0)
				done()
			})
		}))

		it('finds one query parameter', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint?one=first', {}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(Object.entries(request.queryParameters).length === 1)
				assert(request.queryParameters.one === 'first')
				assert(request.url === '/test-endpoint')
				done()
			})
		}))

		it('creates array from duplicate keys', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint?one=first&one=second', {}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(Object.entries(request.queryParameters).length === 1)
				assert.deepEqual(request.queryParameters.one, ['first', 'second'])
				assert(request.url === '/test-endpoint')
				done()
			})
		}))

	})

	describe('logging service handles request headers', () => {
		it('finds application headers when set', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {headers: {'MyApp': 'Header'}}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(request.headers.myapp === 'Header')
				done()
			})
		}))
	})

	describe('logging service handles request body', () => {
		it('empty when not set', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(Object.entries(request.body).length === 0)
				done()
			})
		}))

		it('works when short json', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {json: simpleJson}, done1), (samples) => {
				const {request, response} = samples[0]
				assert.deepEqual(request.body, simpleJson)
				done()
			})
		}))

		it('works when long json', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {json: longJson}, done1), (samples) => {
				const {request, response} = samples[0]
				assert.deepEqual(request.body, longJson)
				done()
			})
		}))

		it('works when text', (done) => assertValidEnv((r) => {
			const text = 'Hello world \n I am Optic'
			session((done1) => r.get('/test-endpoint', {
				body: text,
				headers: {'content-type': 'text/plain'}
			}, done1), (samples) => {
				const {request, response} = samples[0]
				assert.deepEqual(request.body, text)
				done()
			})
		}))

		//This seems to be a bad test. Every API Framework handles this differently.
		// it('will not log body w/o content type', (done) => assertValidEnv((r) => {
		// 	const text = 'Hello world \n I am Optic'
		// 	session((done1) => r.get('/test-endpoint', {body: text}, done1), (samples) => {
		// 		const {request, response} = samples[0]
		// 		assert.deepEqual(request.body, {})
		// 		done()
		// 	})
		// }))
	})

	describe('logging service collects all status codes', () => {
		it('collects 200, 401, 404', (done) => assertValidEnv((r) => {
			session((done1) => {
				const promises = [
					r.get('/test-endpoint', {headers: {'return-status': '200'}}),
					r.get('/test-endpoint', {headers: {'return-status': '401'}}),
					r.get('/test-endpoint', {headers: {'return-status': '404'}})
				]

				Promise.all(promises).then(done1)
			}, (samples) => {
				const set = new Set(samples.map(i => i.response.statusCode))
				assert(set.has('200'))
				assert(set.has('401'))
				assert(set.has('404'))
				done()
			})
		}))

	})

	describe('logging service handles response body', () => {
		it('empty when not set', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {}, done1), (samples) => {
				const {request, response} = samples[0]
				assert(Object.entries(response.body).length === 0)
				done()
			})
		}))

		it('works when short json', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {json: simpleJson}, done1), (samples) => {
				const {request, response} = samples[0]
				assert.deepEqual(response.body, simpleJson)
				done()
			})
		}))

		it('works when long json', (done) => assertValidEnv((r) => {
			session((done1) => r.get('/test-endpoint', {json: longJson}, done1), (samples) => {
				const {request, response} = samples[0]
				assert.deepEqual(response.body, longJson)
				done()
			})
		}))

	})

};
