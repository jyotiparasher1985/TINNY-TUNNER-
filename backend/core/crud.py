"""Generic CRUD helpers for the admin API.

Each editable model is registered in ``REGISTRY`` with:
    - ``model``: the Django model class
    - ``to_dict``: serializer function (obj, request) -> dict
    - ``fields``: list of field names that may be set via create/update
    - ``search``: list of field names used for ?search=
"""

from django.conf import settings
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods, require_GET

from . import models, serializers


def _image_url(field):
    if not field:
        return ""
    try:
        return field.url
    except (ValueError, AttributeError):
        return ""


def _abs(request, url):
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    base = request.build_absolute_uri("/") if request else ""
    return f"{base.rstrip('/')}{url}"


# --------------------------------------------------------------------------- #
# Serializers for the new editable models
# --------------------------------------------------------------------------- #
def hero_slide_dict(o, request=None):
    return {
        "id": o.id, "badge": o.badge, "title": o.title, "lead": o.lead,
        "primary_label": o.primary_label, "primary_to": o.primary_to,
        "secondary_label": o.secondary_label, "secondary_to": o.secondary_to,
        "image": _abs(request, _image_url(o.image)), "image_alt": o.image_alt,
        "order": o.order, "is_published": o.is_published,
    }


def difference_card_dict(o, request=None):
    return {"id": o.id, "num": o.num, "icon": o.icon, "title": o.title,
            "body": o.body, "order": o.order, "is_published": o.is_published}


def value_card_dict(o, request=None):
    return {"id": o.id, "icon": o.icon, "title": o.title, "body": o.body,
            "order": o.order, "is_published": o.is_published}


def timeline_item_dict(o, request=None):
    return {"id": o.id, "year": o.year, "title": o.title, "body": o.body,
            "order": o.order, "is_published": o.is_published}


def team_member_dict(o, request=None):
    return {"id": o.id, "name": o.name, "role": o.role, "note": o.note,
            "order": o.order, "is_published": o.is_published}


def approach_card_dict(o, request=None):
    return {"id": o.id, "title": o.title, "body": o.body,
            "order": o.order, "is_published": o.is_published}


def daily_routine_dict(o, request=None):
    return {"id": o.id, "time": o.time, "label": o.label, "note": o.note,
            "order": o.order, "is_published": o.is_published}


def safety_item_dict(o, request=None):
    return {"id": o.id, "title": o.title, "body": o.body,
            "order": o.order, "is_published": o.is_published}


def timing_row_dict(o, request=None):
    return {"id": o.id, "time": o.time, "label": o.label, "note": o.note,
            "order": o.order, "is_published": o.is_published}


def page_content_dict(o, request=None):
    return {"id": o.id, "key": o.key, "label": o.label, "value": o.value,
            "is_published": o.is_published}


# --------------------------------------------------------------------------- #
# Registry: slug -> (model, serializer, editable fields, search fields)
# --------------------------------------------------------------------------- #
REGISTRY = {
    "hero-slides": (models.HeroSlide, hero_slide_dict,
        ["badge", "title", "lead", "primary_label", "primary_to",
         "secondary_label", "secondary_to", "image_alt", "order", "is_published"],
        ["title", "badge"]),
    "difference-cards": (models.DifferenceCard, difference_card_dict,
        ["num", "icon", "title", "body", "order", "is_published"],
        ["title", "body"]),
    "value-cards": (models.ValueCard, value_card_dict,
        ["icon", "title", "body", "order", "is_published"], ["title", "body"]),
    "timeline-items": (models.TimelineItem, timeline_item_dict,
        ["year", "title", "body", "order", "is_published"], ["title", "body"]),
    "team-members": (models.TeamMember, team_member_dict,
        ["name", "role", "note", "order", "is_published"], ["name", "role"]),
    "approach-cards": (models.ApproachCard, approach_card_dict,
        ["title", "body", "order", "is_published"], ["title", "body"]),
    "daily-routine": (models.DailyRoutine, daily_routine_dict,
        ["time", "label", "note", "order", "is_published"], ["label", "note"]),
    "safety-items": (models.SafetyItem, safety_item_dict,
        ["title", "body", "order", "is_published"], ["title", "body"]),
    "timing-rows": (models.TimingRow, timing_row_dict,
        ["time", "label", "note", "order", "is_published"], ["label", "note"]),
    "page-content": (models.PageContent, page_content_dict,
        ["key", "label", "value", "is_published"], ["key", "label", "value"]),
}


def _clean(value):
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return value


def _bool(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.strip().lower() in ("1", "true", "yes", "on")
    return bool(value)


def _int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _apply_fields(obj, data, fields, image_field=None, request=None):
    for f in fields:
        if f not in data:
            continue
        val = data[f]
        if f == "is_published":
            setattr(obj, f, _bool(val))
        elif f == "order":
            setattr(obj, f, _int(val))
        elif f == "image_alt" or f in ("badge", "title", "lead", "body", "note",
                                       "label", "value", "key", "year", "name",
                                       "role", "icon", "num", "time"):
            setattr(obj, f, _clean(val))
        else:
            setattr(obj, f, _clean(val) if isinstance(val, str) else val)
    return obj


def crud_list(request, slug):
    if slug not in REGISTRY:
        return JsonResponse({"ok": False, "error": "Unknown resource"}, status=404)
    model, serializer, fields, search_fields = REGISTRY[slug]
    qs = model.objects.all()
    q = (request.GET.get("search") or "").strip()
    if q and search_fields:
        from django.db.models import Q
        cond = Q()
        for sf in search_fields:
            cond |= Q(**{f"{sf}__icontains": q})
        qs = qs.filter(cond)
    if "is_published" in [f.name for f in model._meta.fields]:
        if request.GET.get("published") == "0":
            qs = qs.filter(is_published=False)
        elif request.GET.get("published") == "1":
            qs = qs.filter(is_published=True)
    limit = min(int(request.GET.get("limit") or 200), 500)
    return JsonResponse({
        "ok": True, "items": [serializer(o, request) for o in qs[:limit]],
        "total": qs.count(),
    })


@csrf_exempt
@require_http_methods(["POST"])
def crud_create(request, slug):
    if slug not in REGISTRY:
        return JsonResponse({"ok": False, "error": "Unknown resource"}, status=404)
    if not request.user.is_authenticated and not _api_key_ok(request):
        return JsonResponse({"ok": False, "error": "Authentication required."}, status=401)
    model, serializer, fields, search_fields = REGISTRY[slug]
    data = _read_json(request)
    if data is None:
        return JsonResponse({"ok": False, "error": "Malformed JSON body"}, status=400)
    obj = model()
    _apply_fields(obj, data, fields)
    # handle image upload via multipart
    if "image" in request.FILES:
        obj.image = request.FILES["image"]
    try:
        obj.save()
    except Exception as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)
    return JsonResponse({"ok": True, "item": serializer(obj, request)}, status=201)


@csrf_exempt
@require_http_methods(["PATCH", "POST", "DELETE"])
def crud_detail(request, slug, pk):
    if slug not in REGISTRY:
        return JsonResponse({"ok": False, "error": "Unknown resource"}, status=404)
    if not request.user.is_authenticated and not _api_key_ok(request):
        return JsonResponse({"ok": False, "error": "Authentication required."}, status=401)
    model, serializer, fields, search_fields = REGISTRY[slug]
    obj = model.objects.filter(pk=pk).first()
    if not obj:
        return JsonResponse({"ok": False, "error": "Not found"}, status=404)

    if request.method == "DELETE":
        obj.delete()
        return JsonResponse({"ok": True})

    data = _read_json(request)
    if data is None and request.content_type and "json" in request.content_type:
        return JsonResponse({"ok": False, "error": "Malformed JSON body"}, status=400)
    data = data or {}
    _apply_fields(obj, data, fields)
    if "image" in request.FILES:
        obj.image = request.FILES["image"]
    if "remove_image" in data and data["remove_image"]:
        if obj.image:
            obj.image.delete(save=False)
        obj.image = None
    try:
        obj.save()
    except Exception as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=400)
    return JsonResponse({"ok": True, "item": serializer(obj, request)})


def _read_json(request):
    import json
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


# Expose image upload as a dedicated endpoint too (for forms that send files).
@csrf_exempt
@require_http_methods(["POST"])
def upload_image(request):
    if not request.user.is_authenticated and not _api_key_ok(request):
        return JsonResponse({"ok": False, "error": "Authentication required."}, status=401)
    f = request.FILES.get("file") or request.FILES.get("image")
    if not f:
        return JsonResponse({"ok": False, "error": "No file provided"}, status=400)
    folder = (request.POST.get("folder") or "uploads").strip().replace("..", "")
    path = default_storage.save(f"{folder}/{f.name}", f)
    url = default_storage.url(path)
    return JsonResponse({"ok": True, "path": path, "url": url})


@require_GET
def crud_meta(request):
    """Describe which resources exist and their editable fields."""
    out = {}
    for slug, (model, serializer, fields, search_fields) in REGISTRY.items():
        out[slug] = {
            "model": model.__name__,
            "fields": fields,
            "search_fields": search_fields,
            "has_image": any(f.name == "image" for f in model._meta.fields),
        }
    return JsonResponse({"ok": True, "resources": out})