"""Small dependency-free CORS middleware for the Vite dev server."""

import json

from django.conf import settings

ALLOWED = {origin.rstrip("/") for origin in settings.CORS_ALLOWED_ORIGINS}
ALLOW_CREDENTIALS = True
ALLOWED_HEADERS = (
    "accept, accept-encoding, authorization, content-type, origin, user-agent, "
    "x-csrftoken, x-requested-with"
)
ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS"


class CorsMiddleware:
    """Adds CORS headers to every response when the Origin is allow-listed."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS" and "Access-Control-Request-Method" in request.headers:
            response = JsonPreflight(request)
        else:
            response = self.get_response(request)
        self.add_headers(request, response)
        return response

    def add_headers(self, request, response):
        origin = request.headers.get("Origin", "").rstrip("/")
        if ALLOWED and origin not in ALLOWED:
            return
        response["Access-Control-Allow-Origin"] = origin or "*"
        response["Access-Control-Allow-Credentials"] = str(ALLOW_CREDENTIALS).lower()
        response["Access-Control-Allow-Headers"] = ALLOWED_HEADERS
        response["Access-Control-Allow-Methods"] = ALLOWED_METHODS
        response["Access-Control-Max-Age"] = "86400"
        response["Vary"] = "Origin"


class JsonPreflight:
    """Minimal 204 response so the middleware stays free of Django imports."""

    status_code = 204

    def __init__(self, request):
        self.request = request

    def __getitem__(self, item):
        return self

    def __setitem__(self, key, value):
        return None

    @property
    def content(self):
        return b""

    def has_header(self, header):
        return False

    def close(self):
        return None