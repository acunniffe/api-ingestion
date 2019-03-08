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

	if (req.get('return-status')) {
		res = res.status(parseInt(req.get('return-status')));
	} else {
		res = res.status(200);
	}

	if (req.get('Content-Type')) {
		console.log("Content-Type: " + req.get('Content-Type'));
		res = res.type(req.get('Content-Type'));
	}
	res.set(req.headers)
	res.send(req.body);
});

http.createServer(withOptic(app)).listen(50001);
