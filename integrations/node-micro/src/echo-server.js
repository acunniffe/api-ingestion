function echoServerAcceptor(req, res) {
	const statusOverride = req.headers['return-status'];
	if (statusOverride) {
		res.statusCode = parseInt(statusOverride, 10);
	} else {
		res.statusCode = 200;
	}

	Object.keys(req.headers)
		.forEach(headerName => {
			const headerValue = req.headers[headerName];
			res.setHeader(headerName, headerValue);
		});

	req.pipe(res, {end: true});
}

module.exports = {
	echoServerAcceptor
};

