# Using Optic with Django  

Python APIs built with Django are easy to connect to Optic using our custom middleware.

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
