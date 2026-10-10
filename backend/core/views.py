"""JSON API views consumed by the React frontend."""

import json
import re

from django.conf import settings
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods

from .models import (
    Admission,
    ContactMessage,
    FAQ,
    Facility,
    GalleryImage,
    Post,
    Program,
    SiteSetting,
    Testimonial,
)
from .serializers import (
    admission_dict,
    faq_dict,
    facility_dict,
    gallery_dict,
    post_dict,
    program_dict,
    settings_dict,
    testimonial_dict,
)

PHONE_RE = re.compile(r"^[0-9+\-\s()]{7,20}$")
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def error(message, field_errors=None, status=400):
    payload = {"ok": False, "error": message}
    if field_errors:
        payload["field_errors"] = field_errors
    return JsonResponse(payload, status=status)


def clean(value):
    """Trim a string field, mapping missing/None values to an empty string."""
    if value is None:
        return ""
    if isinstance(value, str):
        return value.strip()
    return value


# --------------------------------------------------------------------------- #
# Public content
# --------------------------------------------------------------------------- #
@require_GET
def site_settings(request):
    return JsonResponse({"ok": True, "settings": settings_dict(SiteSetting.load(), request)})


@require_GET
def home(request):
    posts_qs = Post.objects.filter(is_published=True)
    payload = {
        "ok": True,
        "settings": settings_dict(SiteSetting.load(), request),
        "programs": [
            program_dict(p, request)
            for p in Program.objects.all()[:6]
        ],
        "facilities": [
            facility_dict(f, request) for f in Facility.objects.all()[:6]
        ],
        "gallery": [gallery_dict(g, request) for g in GalleryImage.objects.filter(is_published=True)[:8]],
        "notices": [post_dict(p, request) for p in posts_qs.filter(kind=Post.KIND_NOTICE)[:4]],
        "events": [
            post_dict(p, request)
            for p in posts_qs.filter(kind=Post.KIND_EVENT)[:3]
        ],
        "testimonials": [
            testimonial_dict(t) for t in Testimonial.objects.filter(is_published=True)[:6]
        ],
        "faqs": [faq_dict(f) for f in FAQ.objects.filter(is_published=True)[:6]],
    }
    return JsonResponse(payload)


@require_GET
def programs(request):
    return JsonResponse(
        {
            "ok": True,
            "programs": [program_dict(p, request) for p in Program.objects.all()],
        }
    )


@require_GET
def facilities(request):
    return JsonResponse(
        {"ok": True, "facilities": [facility_dict(f, request) for f in Facility.objects.all()]}
    )


@require_GET
def gallery(request):
    items = GalleryImage.objects.filter(is_published=True)
    category = clean(request.GET.get("category"))
    if category:
        items = items.filter(category__iexact=category)
    return JsonResponse(
        {"ok": True, "gallery": [gallery_dict(g, request) for g in items]}
    )


@require_GET
def posts(request):
    kind = (clean(request.GET.get("kind")) or "").upper()
    qs = Post.objects.filter(is_published=True)
    if kind in dict(Post.KIND_CHOICES):
        qs = qs.filter(kind=kind)
    elif kind == "ALL":
        pass
    else:
        qs = qs.exclude(kind=Post.KIND_EVENT)
    limit = min(int(request.GET.get("limit") or 50), 200)
    return JsonResponse({"ok": True, "posts": [post_dict(p, request) for p in qs[:limit]]})


@require_GET
def post_detail(request, slug):
    post = Post.objects.filter(slug=slug, is_published=True).first()
    if not post:
        return error("Post not found", status=404)
    return JsonResponse({"ok": True, "post": post_dict(post, request)})


@require_GET
def testimonials(request):
    return JsonResponse(
        {
            "ok": True,
            "testimonials": [
                testimonial_dict(t) for t in Testimonial.objects.filter(is_published=True)
            ],
        }
    )


@require_GET
def faqs(request):
    return JsonResponse(
        {"ok": True, "faqs": [faq_dict(f) for f in FAQ.objects.filter(is_published=True)]}
    )


# --------------------------------------------------------------------------- #
# Write endpoints
# --------------------------------------------------------------------------- #
def read_json(request):
    try:
        return json.loads(request.body or b"{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        return None


@csrf_exempt
@require_http_methods(["POST"])
def apply_admission(request):
    data = read_json(request)
    if data is None:
        return error("Malformed JSON body")

    fields = {
        "child_name": clean(data.get("child_name")),
        "date_of_birth": clean(data.get("date_of_birth")) or None,
        "gender": clean(data.get("gender")),
        "class_applying": clean(data.get("class_applying")),
        "parent_name": clean(data.get("parent_name")),
        "relation": clean(data.get("relation")) or "MOTHER",
        "phone": clean(data.get("phone")),
        "alternate_phone": clean(data.get("alternate_phone")),
        "email": clean(data.get("email")),
        "address": clean(data.get("address")),
        "city": clean(data.get("city")) or "Panchkula",
        "previous_school": clean(data.get("previous_school")),
        "message": clean(data.get("message")),
        "preferred_contact": clean(data.get("preferred_contact")) or "Phone",
        "needs_transport": bool(data.get("needs_transport")),
    }

    field_errors = {}
    if len(fields["child_name"]) < 2:
        field_errors["child_name"] = "Please enter your child's name."
    if len(fields["parent_name"]) < 2:
        field_errors["parent_name"] = "Please enter the parent's name."
    if not fields["class_applying"]:
        field_errors["class_applying"] = "Please select a class."
    if not PHONE_RE.match(fields["phone"] or ""):
        field_errors["phone"] = "Enter a valid phone number."
    if fields["email"] and not EMAIL_RE.match(fields["email"]):
        field_errors["email"] = "Enter a valid email address."
    if fields["relation"] not in dict(Admission.RELATION_CHOICES):
        field_errors["relation"] = "Select a valid relation."
    if fields["gender"] and fields["gender"] not in dict(Admission.GENDER_CHOICES):
        field_errors["gender"] = "Select a valid option."

    dob = None
    if fields["date_of_birth"]:
        from datetime import date

        try:
            dob = date.fromisoformat(fields["date_of_birth"])
            if dob > date.today():
                field_errors["date_of_birth"] = "Date of birth cannot be in the future."
        except ValueError:
            field_errors["date_of_birth"] = "Use the YYYY-MM-DD format."

    if field_errors:
        return error("Please correct the highlighted fields.", field_errors)

    admission = Admission.objects.create(
        **{**fields, "date_of_birth": dob}
    )
    return JsonResponse(
        {
            "ok": True,
            "message": "Thank you! Our admission team will call you within 24 hours.",
            "reference": admission.reference,
            "admission": admission_dict(admission),
        },
        status=201,
    )


@csrf_exempt
@require_http_methods(["POST"])
def contact(request):
    data = read_json(request)
    if data is None:
        return error("Malformed JSON body")

    name = clean(data.get("name"))
    phone = clean(data.get("phone"))
    email = clean(data.get("email"))
    message = clean(data.get("message"))

    field_errors = {}
    if len(name) < 2:
        field_errors["name"] = "Please enter your name."
    if not PHONE_RE.match(phone or ""):
        field_errors["phone"] = "Enter a valid phone number."
    if email and not EMAIL_RE.match(email):
        field_errors["email"] = "Enter a valid email address."
    if len(message) < 5:
        field_errors["message"] = "Please write your message."
    if field_errors:
        return error("Please correct the highlighted fields.", field_errors)

    ContactMessage.objects.create(
        name=name, phone=phone, email=email, message=message,
        subject=clean(data.get("subject")),
    )
    return JsonResponse(
        {"ok": True, "message": "Thanks for reaching out. We will get back to you soon."},
        status=201,
    )


# --------------------------------------------------------------------------- #
# Simple read-only admin API (list applications for the dashboard screen)
# --------------------------------------------------------------------------- #
@require_GET
def admission_list(request):
    if not request.user.is_authenticated and not _api_key_ok(request):
        return error("Authentication required.", status=401)

    qs = Admission.objects.all()
    status = (clean(request.GET.get("status")) or "").upper()
    if status and status in dict(Admission.STATUS_CHOICES):
        qs = qs.filter(status=status)
    search = clean(request.GET.get("search"))
    if search:
        qs = qs.filter(
            Q(child_name__icontains=search)
            | Q(parent_name__icontains=search)
            | Q(phone__icontains=search)
            | Q(reference__icontains=search)
        )
    return JsonResponse(
        {"ok": True, "admissions": [admission_dict(a) for a in qs[:200]]}
    )


@csrf_exempt
@require_http_methods(["PATCH", "POST"])
def admission_update(request, pk):
    if not request.user.is_authenticated and not _api_key_ok(request):
        return error("Authentication required.", status=401)

    admission = Admission.objects.filter(pk=pk).first()
    if not admission:
        return error("Application not found.", status=404)

    data = read_json(request) or {}
    new_status = clean(data.get("status"))
    if new_status:
        if new_status not in dict(Admission.STATUS_CHOICES):
            return error("Invalid status.", status=400)
        admission.status = new_status
    if "admin_notes" in data:
        admission.admin_notes = clean(data.get("admin_notes"))
    admission.save()

    return JsonResponse({"ok": True, "admission": admission_dict(admission)})


def _api_key_ok(request):
    key = getattr(settings, "ADMIN_API_KEY", "")
    if not key:
        return False
    provided = request.headers.get("X-Admin-Key", "")
    return provided == key