"""Small dependency-free CORS middleware for the Vite dev server."""

from django.http import HttpResponse

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
        origin = request.headers.get("Origin", "").rstrip("/")
        if request.method == "OPTIONS" and "Access-Control-Request-Method" in request.headers:
            response = HttpResponse(status=204)
        else:
            response = self.get_response(request)
        self.add_headers(request, response, origin)
        return response

    def add_headers(self, request, response, origin):
        if ALLOWED and origin not in ALLOWED:
            return
        response["Access-Control-Allow-Origin"] = origin or "*"
        response["Access-Control-Allow-Credentials"] = str(ALLOW_CREDENTIALS).lower()
        response["Access-Control-Allow-Headers"] = ALLOWED_HEADERS
        response["Access-Control-Allow-Methods"] = ALLOWED_METHODS
        response["Access-Control-Max-Age"] = "86400"
        response["Vary"] = "Origin"