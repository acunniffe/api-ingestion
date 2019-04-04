from django.http import HttpResponse
from django.shortcuts import render

blacklistHeaders = ["Connection", "Accept", "Accept-Encoding", "Host", "Content-Length", "Content-Type", "Cache-Control", "User-Agent"]

def homePageViewWithArg(request, path):
    response = HttpResponse(request.body, content_type=request.content_type)
    status_code = 200

    if 'return-status' in request.headers:
        status_code = int(request.headers['return-status'])

    for header in request.headers:
        if not response.has_header(header) and header not in blacklistHeaders:
            response[header] = request.headers[header]

    response.status_code = status_code
    return response


