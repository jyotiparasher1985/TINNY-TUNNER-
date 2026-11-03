"""Admin dashboard: the school's content + admissions control panel."""

from django.contrib import admin, messages
from django.db.models import Q
from django.utils.html import format_html

from .models import (
    Admission,
    ApproachCard,
    ContactMessage,
    DailyRoutine,
    DifferenceCard,
    FAQ,
    Facility,
    GalleryImage,
    HeroSlide,
    PageContent,
    Post,
    Program,
    SafetyItem,
    SiteSetting,
    TeamMember,
    Testimonial,
    TimelineItem,
    TimingRow,
    ValueCard,
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
    list_display = ("school_name", "phone", "email", "address", "admission_session")
    list_display_links = ("school_name",)

    fieldsets = (
        ("School identity", {
            "fields": ("school_name", "tagline", "established", "admission_session"),
        }),
        ("Contact details", {
            "fields": ("phone", "whatsapp", "email", "address", "map_url"),
        }),
        ("Homepage counters", {
            "fields": ("stats",),
            "description": "JSON object shown on the homepage stats strip, e.g. {\"students\": \"320+\", \"years\": \"18+\", \"teacher_ratio\": \"1:8\", \"activities\": \"25+\"}.",
        }),
    )

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
@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("thumb", "title", "badge", "order", "is_published")
    list_editable = ("order", "is_published")
    list_display_links = ("thumb", "title")
    search_fields = ("title", "badge", "lead")

    @admin.display(description="Cover")
    def thumb(self, obj):
        if not obj.image:
            return "—"
        return format_html('<img src="{}" style="height:40px;border-radius:6px;object-fit:cover" />', obj.image.url)


@admin.register(DifferenceCard)
class DifferenceCardAdmin(admin.ModelAdmin):
    list_display = ("num", "title", "icon", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "body")


@admin.register(ValueCard)
class ValueCardAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "body")


@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ("year", "title", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "body")


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("name", "role", "note")


@admin.register(ApproachCard)
class ApproachCardAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "body")


@admin.register(DailyRoutine)
class DailyRoutineAdmin(admin.ModelAdmin):
    list_display = ("time", "label", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("label", "note")


@admin.register(SafetyItem)
class SafetyItemAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("title", "body")


@admin.register(TimingRow)
class TimingRowAdmin(admin.ModelAdmin):
    list_display = ("time", "label", "order", "is_published")
    list_editable = ("order", "is_published")
    search_fields = ("label", "note")


@admin.register(PageContent)
class PageContentAdmin(admin.ModelAdmin):
    list_display = ("key", "label", "is_published")
    list_editable = ("is_published",)
    search_fields = ("key", "label", "value")
    readonly_fields = ("created_at", "updated_at")