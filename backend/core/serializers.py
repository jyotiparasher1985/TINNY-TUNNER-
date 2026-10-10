"""JSON serialisation helpers (plain Django, no extra dependencies)."""

from django.conf import settings


def image_url(field):
    if not field:
        return ""
    try:
        return field.url
    except ValueError:
        return ""


def absolute(request, url):
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    base = request.build_absolute_uri("/") if request else ""
    return f"{base.rstrip('/')}{url}"


def program_dict(program, request=None):
    return {
        "id": program.id,
        "name": program.name,
        "slug": program.slug,
        "age_group": program.age_group,
        "summary": program.summary,
        "details": program.details,
        "image": absolute(request, image_url(program.image)),
        "features": program.feature_list,
    }


def facility_dict(facility, request=None):
    return {
        "id": facility.id,
        "name": facility.name,
        "slug": facility.slug,
        "description": facility.description,
        "image": absolute(request, image_url(facility.image)),
    }


def post_dict(post, request=None):
    return {
        "id": post.id,
        "kind": post.kind,
        "kind_label": post.kind_label,
        "title": post.title,
        "slug": post.slug,
        "summary": post.summary,
        "body": post.body,
        "image": absolute(request, image_url(post.image)),
        "event_date": post.event_date.isoformat() if post.event_date else None,
        "event_time": post.event_time,
        "location": post.location,
        "is_featured": post.is_featured,
        "published_at": post.published_at.isoformat(),
    }


def gallery_dict(item, request=None):
    return {
        "id": item.id,
        "image": absolute(request, image_url(item.image)),
        "caption": item.caption,
        "category": item.category,
    }


def testimonial_dict(item):
    return {
        "id": item.id,
        "parent_name": item.parent_name,
        "child_class": item.child_class,
        "quote": item.quote,
    }


def faq_dict(item):
    return {"id": item.id, "question": item.question, "answer": item.answer}


def settings_dict(obj, request=None):
    map_url = obj.map_url or (
        "https://www.google.com/maps/search/?api=1&query="
        "Tiny+Turners+Play+Way+School+Lala+Wala+Peer+Road+Barwala"
    )
    return {
        "school_name": obj.school_name,
        "tagline": obj.tagline,
        "phone": obj.phone,
        "whatsapp": obj.whatsapp,
        "email": obj.email,
        "address": obj.address,
        "map_url": map_url,
        "established": obj.established,
        "admission_session": obj.admission_session,
        "stats": obj.stats or {},
    }


def admission_dict(admission):
    return {
        "id": admission.id,
        "reference": admission.reference,
        "child_name": admission.child_name,
        "date_of_birth": admission.date_of_birth.isoformat() if admission.date_of_birth else None,
        "gender": admission.get_gender_display(),
        "class_applying": admission.class_applying,
        "previous_school": admission.previous_school,
        "parent_name": admission.parent_name,
        "relation": admission.get_relation_display(),
        "phone": admission.phone,
        "alternate_phone": admission.alternate_phone,
        "email": admission.email,
        "address": admission.address,
        "city": admission.city,
        "message": admission.message,
        "preferred_contact": admission.preferred_contact,
        "needs_transport": admission.needs_transport,
        "status": admission.status,
        "status_label": admission.get_status_display(),
        "created_at": admission.created_at.isoformat(),
    }