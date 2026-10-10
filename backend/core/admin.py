"""Admin dashboard: the school's content + admissions control panel."""

from django.contrib import admin, messages
from django.db.models import Q
from django.utils.html import format_html

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


def _thumb(field, height=56):
    if not field:
        return "—"
    return format_html(
        '<img src="{}" style="height:{}px;border-radius:8px;object-fit:cover" />',
        field.url, height,
    )


@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ("school_name", "phone", "email", "address")

    def has_add_permission(self, request):
        return not SiteSetting.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "age_group", "order", "is_ready")
    list_editable = ("order",)
    list_display_links = ("thumb", "name")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "summary")

    @admin.display(description="")
    def thumb(self, obj):
        return _thumb(obj.image)

    @admin.display(boolean=True, description="Ready")
    def is_ready(self, obj):
        return bool(obj.summary and obj.features)


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ("thumb", "name", "order")
    list_editable = ("order",)
    list_display_links = ("thumb", "name")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name", "description")

    @admin.display(description="")
    def thumb(self, obj):
        return _thumb(obj.image)


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("cover", "title", "kind", "is_featured", "is_published", "published_at")
    list_filter = ("kind", "is_published", "is_featured")
    list_editable = ("is_featured", "is_published")
    prepopulated_fields = {"slug": ("title",)}
    search_fields = ("title", "summary", "body")
    date_hierarchy = "published_at"
    fieldsets = (
        ("Post", {"fields": ("kind", "title", "slug", "summary", "body", "image")}),
        ("Event details", {
            "classes": ("collapsed",),
            "fields": ("event_date", "event_time", "location"),
        }),
        ("Publishing", {"fields": ("is_published", "is_featured", "published_at")}),
    )

    @admin.display(description="Cover")
    def cover(self, obj):
        return _thumb(obj.image)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ("preview", "caption", "category", "order", "is_published")
    list_editable = ("order", "is_published")
    list_filter = ("category", "is_published")
    search_fields = ("caption", "category")

    @admin.display(description="Photo")
    def preview(self, obj):
        return _thumb(obj.image)


class AdmissionStageFilter(admin.SimpleListFilter):
    """Shortcut filter: still-open vs finished applications."""

    title = "admission stage"
    parameter_name = "stage"

    def lookups(self, request, model_admin):
        return (
            ("open", "Still open (New / Contacted / Visit)"),
            ("done", "Finished (Confirmed / Closed)"),
        )

    def queryset(self, request, queryset):
        if self.value() == "open":
            return queryset.exclude(
                status__in=[Admission.STATUS_CONFIRMED, Admission.STATUS_CLOSED]
            )
        if self.value() == "done":
            return queryset.filter(
                status__in=[Admission.STATUS_CONFIRMED, Admission.STATUS_CLOSED]
            )
        return queryset


@admin.register(Admission)
class AdmissionAdmin(admin.ModelAdmin):
    list_display = (
        "reference", "child_name", "class_applying", "parent_name",
        "phone", "status", "needs_transport", "created_at",
    )
    list_filter = ("status", AdmissionStageFilter, "class_applying", "needs_transport", "created_at")
    list_editable = ("status",)
    search_fields = ("reference", "child_name", "parent_name", "phone", "email")
    readonly_fields = ("reference", "created_at", "updated_at")
    date_hierarchy = "created_at"
    actions = ["mark_contacted", "mark_confirmed", "mark_closed"]
    fieldsets = (
        ("Application", {
            "fields": ("reference", "status", "admin_notes", "created_at", "updated_at"),
        }),
        ("Child", {
            "fields": ("child_name", "date_of_birth", "gender", "class_applying", "previous_school"),
        }),
        ("Parent / Guardian", {
            "fields": (
                "parent_name", "relation", "phone", "alternate_phone",
                "email", "address", "city",
            ),
        }),
        ("Requirements", {
            "fields": ("preferred_contact", "needs_transport", "message"),
        }),
    )

    @admin.action(description="Mark selected as Contacted")
    def mark_contacted(self, request, queryset):
        updated = queryset.update(status=Admission.STATUS_CONTACTED)
        self.message_user(request, f"{updated} application(s) marked contacted.", messages.SUCCESS)

    @admin.action(description="Mark selected as Confirmed")
    def mark_confirmed(self, request, queryset):
        updated = queryset.update(status=Admission.STATUS_CONFIRMED)
        self.message_user(request, f"{updated} application(s) confirmed.", messages.SUCCESS)

    @admin.action(description="Mark selected as Closed")
    def mark_closed(self, request, queryset):
        updated = queryset.update(status=Admission.STATUS_CLOSED)
        self.message_user(request, f"{updated} application(s) closed.", messages.WARNING)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "subject", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    list_editable = ("is_read",)
    search_fields = ("name", "phone", "email", "message")
    readonly_fields = ("created_at",)


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("parent_name", "child_class", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("parent_name", "quote")


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ("question", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("question", "answer")


admin.site.site_header = "Tiny Turners — Admin Dashboard"
admin.site.site_title = "Tiny Turners Admin"
admin.site.index_title = "School content & admissions"