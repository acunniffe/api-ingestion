# Optic for Flask  

Python APIs built on top of Flask are easy to connect to Optic using our custom middleware. 

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
    if 'OPTIC_SERVER_LISTENING' in os.environ:
        OpticDocumentingMiddleware(app)
    return app
``` 
