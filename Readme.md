# API Ingestion End-End Tests [![Build Status](https://travis-ci.org/opticdev/api-ingestion-tests.svg?branch=master)](https://travis-ci.org/opticdev/api-ingestion-tests)

## Running Tests
Test all SDKs  `npm run test`

Test single SDK `npm --sdk_id=akka-http run testOnly`


## Terms
* Documenting SDKs - Optic's SDKs that log the request/responses in your API tests. These are used to infer the surface area and shape of an API. Each SDK is stored in `sdks/`
* Subjects - Test environments for each SDK that implement an echo server.
* Shared tests - the end-end tests that runs for each of the subjects `tests/shared-tests.js`. These shared test cases validate that each Optic SDK accurately logs the request/response to Optic. 
* Manifest - The registry of all the documenting APIs Optic supports. Manifest entries look like this:
```json
  "node-express": {
    "name": "Express JS",
    "sdk": "sdks/node-express",
    "documentation": "sdks/node-express/Readme.md",
    "test": "subjects/node/express", 
    "status": "production", //development or production (development is ignored by docs.useoptic.com)
    "current-version": "0.2.0",
    "link": "https://www.npmjs.com/package/@useoptic/document-express",
    "supported-targets": "4.x",
    "author": "opticdev" //author's github ID
  }
```


## SDK Structure
- A library implements Optic's logging protocol in the context of the API Framework targeted.  
- A Readme explaining how to use the the SDK in your code. 
- (Not Included) Keys required to publish the library. These will be generated and securely stored by Optic

## Subjects Structure
-  `Dockerfile` - in root directory.
    - Build a docker image capable of running the echo server
    - Includes a `CMD` to start the echo server on port 4000
-  The echo server to be copied into the Docker Image
    - All requests accepted by any path 
    - Returns request headers as response headers 
    - Returns request body as response body
    - Status code defaults to 200, if a header named `return-status` is passed, the integer value of it will be the status code of the response

### Test Lifecycle  
1) Docker image with all the dependencies needed to run the subject environments
2) The tests are started in the container by running `npm run tests`
3) Each subject environment is built and the echo server is bound to a predefined port
4) The shared tests run sequentially over each test environment 
5) Process exits with 0 if all tests pass, non-zero if failed. 
