
function withOptic(micro) {
	const {addHooks} = require('../src/interaction-logger');
	return function (handler) {
		return micro((req, res) => {
			addHooks(req, res);
			return handler(req, res);
		});
	};
}

function echoServer(micro) {
	const port = process.env.OPTIC_SERVER_PORT;

	const {echoServerAcceptor} = require('../src/echo-server');
	return micro(echoServerAcceptor).listen(port, (err) => {
		if (err) {
			return console.error(err);
		}
		console.log('echo server started')
	});
}

module.exports = {
	withOptic,
	echoServer
};