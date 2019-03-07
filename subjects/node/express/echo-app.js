const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const withOptic = require('@useoptic/document-express')

const request = require('request')

const app = express();
app.use(bodyParser.text({
	type: function(req) {
		return 'text';
	}
}));

app.all('*', function (req, res) {
	console.log(req.body);
	res = res.status(200);
	if (req.get('Content-Type')) {
		console.log("Content-Type: " + req.get('Content-Type'));
		res = res.type(req.get('Content-Type'));
	}
	res.send(req.body);
});

console.log('abc')
request.get('http://localhost:30334/go', (err) => {
	console.log('connect callback')
	console.log(err)
})

http.createServer(withOptic(app)).listen(4000);
