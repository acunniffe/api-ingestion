const micro = require('micro');
const {withOptic, echoServer} = require('@useoptic/document-node-http/micro');

echoServer(withOptic(micro));