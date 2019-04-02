# Contributing a Framework Integration
> Specification for Integrating Optic with an API Framework 

> Estimated development time 4 hours

Most of the popular API frameworks don't make documentation a first-class concern. This means most teams end up being responsible for maintaining documentation manually. There's certainly a better way to document our APIs. A simple command like `api:document` should be able to document APIs written in any framework. 
 
If you believe in the vision outlined above, you can help bring about that reality by building API Framework Integrations that conform to this specification. It takes <3 hrs, you'll be fully supported by our core maintainers and once you finish everybody using `Framework X` will be able to document their APIs with a single command. 

Let's get started! Make a new branch called `integration-{framewoork}-development`! 

## Development Overview

You'll be building...

1. Middleware for the target API Framework that logs every request / response that hits your API during testing to the local Optic documenting server. It's usually very easy to Google for something like "log request and response {framework} middleware" and find most of the code you need. Examples in `integrations/`

2. A library containing the middleware that can be published to your target language's package manager. Naming convention is `document-{framework}` ie `documenting-akka-http`

3. A test environment to validate the middleware works as expected. Examples live in `subjects/`. Optic runs shared test suites over all of the integrations to make sure they all meet the functional requirements 

4. A short Readme explaining how users can include your middleware in their project


### Setup your Test Environment 

Add an entry to `manifest.json`
```json
  "new-framework": {
    "name": "New Framework",
    "integration": "integrations/framework",
    "documentation": "integrations/framework/Readme.md",
    "test": "subjects/path/to/test/enviroment/", 
    "status": "development", //development or production (development is ignored by docs.useoptic.com)
    "current-version": "0.2.0",
    "link": "https://www.package-manager-for-lang.com/document-framework",
    "supported-targets": "4.x",
    "author": "opticdev" //author's github ID
  }
```


Then start implement an echo server in your API Framework. These go in `subjects/{langague}/{framework}`. There are plenty of examples already in `subjects/` you can check out. 

Here's the structure of your test environment:
 
-  `Dockerfile` - in root directory.
    - Build a docker image capable of running the echo server
    - Includes a `CMD` to start the echo server on port 4000
-  The functional requirements of the echo server that should run in Docker are as follows: 
    - A request to any path in the API should be accepted
    - Returns all request headers as response headers 
    - Returns request body as response body (with correct content-type and content-length)
    - Status code defaults to 200, if a header named `return-status` is passed, the integer value of it will be the status code of the response

To test if your echo server implements the functional requirements above run `npm --sdk_id=new-framework run testOnlyEchoServer` 

Once implemented, you're ready to move onto implementing the middleware. 

### Middleware & Library 

Add a new directory in `integrations/{framework}`
> eventually you'll want to move your middleware library here, but for now you'll move faster if you develop the middleware within your test environment. 

**Documenting API Contracts by Logging** 

Optic documents an APIs contract by logging every request / response that hits the API while your tests run. 
- To start this flow a user runs `optic api:document`
- Optic will start listening on two ports (one to collect logged requests and one to collected logged responses)
- Optic runs your API tests with whatever command you supplied to it ie `npm run test`

> This is the part of the flow you implement

- Middleware forwards each request to the **Request Logger** (defaults to localhost:30334). Just change the base path of the URL to the **Request Logger** and send all the same headers and body. 
- The **Request Logger** will respond with an `interactionId` in the body (`text/plain`, parse the whole thing as a string). 
- Use the **Response Logger** (defaults to localhost:30335) to save the response by calling `POST localhost:30335/interactions/{interactionId}/status/{response.statusCode}`. In that request include the headers, and body returned by your server. Optic associates the response to the request you sent the **Request Logger** by using the `interactionId`.

That's it, basically just making Optic a man-in-the-middle so it can document the API. This logging of course only happens when your tests run and is never meant to occur in production. To ensure that Optic only runs in your test environment you need to listen for a few environment variables: 

- `OPTIC_SERVER_LISTENING` - Only present when running an Optic session. Skip the Optic middleware if not included
- `OPTIC_SERVER_HOST` - (optional, set default to `localhost`) Allows you to specify which host Optic is running on. Useful when you're documenting APIs running in containers.

The expected integration pattern would be something like what we do for the Rails integration (only adding the middleware if `OPTIC_SERVER_LISTENING` is present)
```ruby
if ENV['OPTIC_SERVER_LISTENING']
    config.middleware.use OpticTestFixture::DocumentingMiddleware
end
```

**Functional Requirements** 

The shared test suites will verify all of these requirements. Run `npm --sdk_id={sdkId} run testOnly`. 

1. All requests / responses that hit the API are logged accurately to Optic.
2. Middleware does not log to Optic unless `OPTIC_SERVER_LISTENING` env variable is present 
3. Requests are logged to `{OPTIC_SERVER_HOST}:30334`
4. Responses are logged to `{OPTIC_SERVER_HOST}:30335`
5. Middleware does not mutate request or change the APIs behavior. It's a passive listener 

To verify that your middleware implements these functional requirements correctly run: `npm --sdk_id=new-framework run testOnly`. It's likely a few tests will fail the fist time you run this. If you can track down the issues in your middleware and get everything passing you've done it!

**Publishing**

Once the middleware works, get it ready to publish on a package manager. The first step is to move it out of the test environment and into `integrations/{framework}`. You'll need to coordinate with Optic to make sure publishing keys are stored securely and injected into the builds. Email aidan@useoptic.com when you get to this stage. 

Once you've created a library for the middleware you'll want to have your test environment depend on it so the end-end test mirrors the production user setup.

## Add a ReadMe
A quick readme goes a long way. Include a reference to your readme in `manifest.json` to have it synced with `docs.useoptic.com`. Here are a few examples to copy: 
- [Express JS](/integrations/node-express/Readme.md)  
- [Rails](/integrations/ruby-rack/README.md)  
- [Flask](/integrations/python-flask/README.md)  


# Create a PR
When all the tests pass for your new API Integration, create a PR. We'll review it ASAP, get it merged in and send you $150 Amazon giftcard, and some Optic swag as a thank you from the community :)  
