from flask import Flask, jsonify, request, Response
from functools import wraps
from werkzeug.routing import Rule
from optparse import OptionParser
from pprint import pprint
import time

VERBOSE = 'verbose'
BASIC_AUTH = 'basic_auth'
AUTH_USERNAME = 'auth_username'
AUTH_PASSWORD = 'auth_password'

config = {
    BASIC_AUTH: False,
    VERBOSE: False
}

app = Flask(__name__)

app.url_map.add(Rule('/', defaults={'path': ''}, endpoint='index'))
app.url_map.add(Rule('/<path:path>', endpoint='index'))


def extract(d):
    return {key: value for (key, value) in d.items()}


def check_auth(username, password):
    if AUTH_USERNAME not in config or AUTH_PASSWORD not in config:
        return False

    return username == config[AUTH_USERNAME] and password == config[AUTH_PASSWORD]


def authenticate():
    return Response(
        'Could not verify your access level for that URL.\n'
        'You have to login with proper credentials', 401,
        {'WWW-Authenticate': 'Basic realm="Login Required"'})


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not config[BASIC_AUTH]:
            return f(*args, **kwargs)
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return f(*args, **kwargs)

    return decorated


@app.endpoint('index')
def echo(path):
    status_code = request.headers.get('return-status') or 200

    data = request.data

    if config[VERBOSE]:
        pprint(data)


    response = app.response_class(
        response=data,
        status=status_code,
        headers=extract(request.headers),
        mimetype=request.headers.get('content-type')
    )

    return response


def main():
    parser = OptionParser()
    parser.add_option('--port', dest='port', default=5000, help='port to run server on - default 5000')
    parser.add_option('--host', dest='host', default='127.0.0.1', help='host to bind server on - default 127.0.0.1')
    parser.add_option('--auth', dest='auth',
                      help='basic authentication credentials, should be passed in like "username:password"')
    parser.add_option('-v', '--verbose', dest='verbose',
                      default=False, action='store_true', help='increased verbosity - outputs response to console')
    parser.add_option('--debug', dest='debug',
                      default=False, action='store_true', help='enable debug mode in flask')

    (options, args) = parser.parse_args()

    config[VERBOSE] = options.verbose

    if options.auth:
        username, password = options.auth.split(':')
        if username is None or password is None:
            parser.error('Invalid auth credentials {0}'.format(options.auth))

        config[BASIC_AUTH] = True
        config[AUTH_USERNAME] = username
        config[AUTH_PASSWORD] = password

    app.debug = options.debug
    app.run(port=int(options.port), host=options.host)
    if 'OPTIC_SERVER_LISTENING' in os.environ:
        OpticDocumentingMiddleware(app)


if __name__ == '__main__':
    main()
