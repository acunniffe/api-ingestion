const assert = require('assert')
const request = require('request')
const session = require('./optic-session')
const {simpleJson, longJson} = require('./test-bodies')

exports.echoServerImplementationTests = (p) => {

	const assertValidEnv = (callback) => {
		p.then((env) => {
			assert(true)
			callback(request.defaults({
				baseUrl: `http://localhost:${env.testPort}`,
				strictSSL: false,
				timeout: 100000,
			}), env)
		})
		p.catch(() => {
			assert(false)
		})
	}


	describe('echo server', () => {

		it('handles requests to any path with 200', (done) => assertValidEnv((r) => {
			const testUrl = (url, method) => new Promise((resolve, reject) => {
				r(url, {method}, (err, response) => (err) ? resolve(false) : resolve(response.statusCode === 200))
			})
			Promise.all([
				testUrl('/hello/world', 'GET'),
				testUrl('/hello/world', 'POST'),
				testUrl('/test-endpoint', 'POST'),
				testUrl('/test/123', 'POST'),
				testUrl('/any/12/route', 'POST'),
			]).then((arr) => {
				assert(arr.every((i) => i))
			}).catch(() => {
				assert(false)
			}).finally(done)

		}))


		it('returns request headers as response headers', (done) => assertValidEnv((r) => {
			r.get('/test-endpoint', {headers: {'example-one': 'set', 'example-two': 'set'}}, (err, response) => {
				assert(response.headers['example-one'] === 'set')
				assert(response.headers['example-two'] === 'set')
				done()
			})
		}))

		it('returns request body as response body with correct types', (done) => assertValidEnv((r) => {
			const body = {first: 'one', second: 'two', third: 'third'}
			r.get('/test-endpoint', {json: body}, (err, response, resBody) => {
				assert(typeof resBody === 'object')
				assert(JSON.stringify(body) === JSON.stringify(resBody))
				assert(response.headers['content-type'].includes('application/json'))
				done()
			})
		}))

		it('"return-status" header overrides status code', (done) => assertValidEnv((r) => {

			const testStatusCode = (status) => new Promise((resolve, reject) => {
				r('/test-endpoint', {headers: {'return-status': status.toString()}}, (err, response) => (err) ? resolve(false) : resolve(response.statusCode === status))
			})

			Promise.all([
				testStatusCode(200),
				testStatusCode(204),
				testStatusCode(405),
				testStatusCode(412),
				testStatusCode(311),
			]).then((arr) => {
				assert(arr.every((i) => i))
			}).catch(() => {
				assert(false)
			}).finally(done)

		}))

	})

};
