"""Root URL configuration."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def api_root(request):
    return JsonResponse(
        {
            "ok": True,
            "service": "Tiny Turners API",
            "endpoints": [
                "api/settings/", "api/home/", "api/programs/", "api/facilities/",
                "api/gallery/", "api/posts/", "api/testimonials/", "api/faqs/",
                "api/admissions/apply/", "api/contact/",
            ],
        }
    )


urlpatterns = [
    path("", api_root),
    path("admin/", admin.site.urls),
    path("api/", include("core.urls")),
]

# Django serves uploaded media itself while DEBUG is on.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.BASE_DIR / "static")