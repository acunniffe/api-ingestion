import http
import os

from django.utils.deprecation import MiddlewareMixin

optic_host = os.getenv('OPTIC_SERVER_HOST', 'localhost')

class DocumentDjango(MiddlewareMixin):
    def __init__(self, *args, **kwargs):
        """Constructor method."""

        super().__init__(*args, **kwargs)

    def process_response(self, request, response):
        if 'OPTIC_SERVER_LISTENING' in os.environ:
            try:
                try:
                    request_body_size = int(request.environ.get('CONTENT_LENGTH', 0))
                except (ValueError):
                    request_body_size = 0

                request_logger = http.client.HTTPConnection(optic_host, 30334)
                response_logger = http.client.HTTPConnection(optic_host, 30335)
                request_body = request.body if request_body_size > 0 else None

                requestHeaders = {}
                for key, value in request.headers._store.items():
                    requestHeaders[value[0]] = value[1]

                if request_body is None:
                    requestHeaders['Content-Length'] = 0

                request_logger.request(request.method, request.get_full_path(), request_body, requestHeaders)

                # Log Request
                logger_response = request_logger.getresponse()
                interactionId = logger_response.read(logger_response.length).decode("utf-8")

                responseHeaders = {}
                for key, value in response._headers.items():
                    responseHeaders[value[0]] = value[1]

                # Log Response
                response_logger_path = "/interactions/" + interactionId + "/status/" + str(response.status_code)
                response_logger.request("POST", response_logger_path, response.content, responseHeaders)
                response_logger_response = response_logger.getresponse()
            except:
                print("error logging to Optic")

        return response

# Meta information
name = "optic-document-django"
