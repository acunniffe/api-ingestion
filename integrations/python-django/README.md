# Optic for Django  

## Optic Proxy Setup
Python APIs built in Django are easy to connect to Optic using our custom middleware. In this tutorial we'll show you how to connect the Optic Documenting Middleware to your Django app so that your integration tests document your code as they execute. 

## Add the Middleware to your Project
Install the Optic Documenting Middleware using pip
```bash
pip3 install optic-document-django
``` 

### Making the Middleware Run During Testing
Now add the middleware to the `settings.py` file that configures the Django API. You should put the middleware at the very bottom of the stack. 
```python
MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
    'optic.DocumentDjango'
]
``` 

## Using the Middleware in your tests
The Documenting middleware will document all the requests/responses that your tests run. Since it is integrated at the middleware level there's no need to update any of your tests files or fixtures. 
