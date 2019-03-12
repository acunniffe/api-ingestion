const request = require('request')

request.get('http://localhost:50002/test-endpoint', {headers: {'return-status': '405'}} , (err, res, body) => {
	console.log(res.statusCode)
})
