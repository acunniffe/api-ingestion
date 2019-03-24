# API Ingestion End-End Tests [![Build Status](https://travis-ci.org/opticdev/api-ingestion-tests.svg?branch=master)](https://travis-ci.org/opticdev/api-ingestion-tests)

___
Config:
  @useoptic/core": "^0.1.3-alpha.17
  
  **Documenting SDKs**
  document-express: 0.1.5
  
___


```npm run docker-tests```

## Overview
* Documenting SDKs - Optic's SDKs that log the request/responses in your API tests. These are used to infer the shape and surface area of the API 
* subject/ - test environments for each of the Documenting SDKs. Each test environment is an echo server. Request Headers + Body are echoed 1:1 in the response. The status code of the response is controlled by a header called `return-status`.  
* tests/shared-tests.js - the end-end tests that runs for each of the subjects. The same suite is used to validate the same behavior across all Documenting SDKs

### Test Lifecycle  
1) Docker builds an image with all the dependencies needed to run the subject environments
2) The tests are started in the container by running `npm run tests`
3) Each subject environment is built and the echo server is bound to a predefined port
4) The shared tests run sequentially over each test environment 
5) Process exits with 0 if all tests pass, non-zero if failed. 


## Requirements for adding a new Subject
* Implement an echo server for the API Framework you wish to test. Add the Documenting SDK to the server before binding to a port. 
* Add language/runtime dependencies to `Dockerfile` ie install ruby, sbt, go, etc. 
* Add a `start.sh` to the root directory of your echo server. This script should setup the test environment and then start the server.  
* Add an entry to `tests/enviroments` 
```javascript
'my-env': buildEnv('my-env', '/subjects/lang/framework', 50001 /* unique port */)
```
* Add your subject to `test-entry.test.js`
```javascript
	describe('node-express', () => {
		sharedTests.sharedObservationsTest(getEnv('node-express'))
	})
```

## Running Tests
Test All `npm run test`
Test Single Suite `npm --sdk_id=akka-http run testOnly`
