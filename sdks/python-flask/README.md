# Optic for Flask  

## Optic Proxy Setup
Python APIs built on top of Flask are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Flask app so that your integration tests document your code as they execute. 

## Add the Middleware to your Project
Install the Optic Documenting Middleware using pip
```bash
pip3 install optic-document-flask
``` 

### Making the Middleware Run During Testing
Now add the middleware to your Flask App. Since we only want the middleware to run while Optic executes your tests, make sure you wrap it in a check for the `OPTIC_SERVER_LISTENING` environment variable.

We like performing this check within the block where we setup our test config, but you can do it anywhere that makes sense for your app. 
```python
from optic import OpticDocumentingMiddleware

def create_app(test_config=None):

    # Setup Code...

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        if 'OPTIC_SERVER_LISTENING' in os.environ:
            OpticDocumentingMiddleware(app)
        app.config.update(test_config)
    return app
``` 

## Using the Proxy Fixture
The Documenting middleware will document all the requests/responses that your tests run. Since it is integrated at the middleware level there's no need to update any of your tests files or fixtures. 
