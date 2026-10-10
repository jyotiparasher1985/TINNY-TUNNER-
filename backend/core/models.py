"""Database models for the Tiny Turners Play Way School website."""

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.text import slugify
from django.utils import timezone


def unique_slug(instance, value, slug_field="slug"):
    """Build a slug that is unique within the model's table."""
    base = slugify(value) or "item"
    slug = base
    model = instance.__class__
    counter = 2
    qs = model.objects.exclude(pk=instance.pk)
    while qs.filter(**{slug_field: slug}).exists():
        slug = f"{base}-{counter}"
        counter += 1
    return slug


class TimeStamped(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# --------------------------------------------------------------------------- #
# Site configuration
# --------------------------------------------------------------------------- #
class SiteSetting(TimeStamped):
    """Singleton row holding the school-wide contact details."""

    school_name = models.CharField(max_length=150, default="Tiny Turners")
    tagline = models.CharField(max_length=150, default="Play Way School")
    phone = models.CharField(max_length=20, default="9467403080")
    whatsapp = models.CharField(max_length=20, default="919467403080")
    email = models.EmailField(blank=True, default="info@tinyturners.edu.in")
    address = models.CharField(
        max_length=250, default="Lala Wala Peer Road, Barwala, Panchkula"
    )
    map_url = models.URLField(blank=True, default="")
    established = models.CharField(max_length=20, default="2007")
    admission_session = models.CharField(max_length=30, default="2026-27")
    # Homepage counters: {"students": "320", ...}
    stats = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Site settings"
        verbose_name_plural = "Site settings"

    def __str__(self):
        return self.school_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


# --------------------------------------------------------------------------- #
# Academics / facilities
# --------------------------------------------------------------------------- #
class Program(TimeStamped):
    """An academic programme shown on the Academics page."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    age_group = models.CharField(max_length=80, blank=True)
    summary = models.TextField()
    details = models.TextField(blank=True)
    image = models.ImageField(upload_to="programs/", blank=True, null=True)
    features = models.TextField(
        blank=True, help_text="One feature per line."
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def feature_list(self):
        return [line.strip() for line in self.features.splitlines() if line.strip()]


class Facility(TimeStamped):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to="facilities/", blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# --------------------------------------------------------------------------- #
# Notices / news / events
# --------------------------------------------------------------------------- #
class Post(TimeStamped):
    KIND_NOTICE = "NOTICE"
    KIND_NEWS = "NEWS"
    KIND_EVENT = "EVENT"
    KIND_CHOICES = [
        (KIND_NOTICE, "Notice"),
        (KIND_NEWS, "News"),
        (KIND_EVENT, "Event"),
    ]

    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default=KIND_NOTICE)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    summary = models.CharField(max_length=300, blank=True)
    body = models.TextField(blank=True)
    image = models.ImageField(upload_to="posts/", blank=True, null=True)
    event_date = models.DateField(blank=True, null=True)
    event_time = models.CharField(max_length=60, blank=True)
    location = models.CharField(max_length=150, blank=True)
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-published_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug(self, self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def kind_label(self):
        return self.get_kind_display()


class GalleryImage(TimeStamped):
    image = models.ImageField(upload_to="gallery/")
    caption = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=60, blank=True, default="Campus")
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-created_at"]
        verbose_name_plural = "Gallery images"

    def __str__(self):
        return self.caption or f"Gallery image {self.pk}"


# --------------------------------------------------------------------------- #
# Admissions
# --------------------------------------------------------------------------- #
class Admission(TimeStamped):
    STATUS_NEW = "NEW"
    STATUS_CONTACTED = "CONTACTED"
    STATUS_VISIT = "VISIT"
    STATUS_CONFIRMED = "CONFIRMED"
    STATUS_CLOSED = "CLOSED"
    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_VISIT, "School Visit"),
        (STATUS_CONFIRMED, "Confirmed"),
        (STATUS_CLOSED, "Closed"),
    ]

    GENDER_CHOICES = [("MALE", "Male"), ("FEMALE", "Female"), ("OTHER", "Other")]
    RELATION_CHOICES = [
        ("FATHER", "Father"),
        ("MOTHER", "Mother"),
        ("GUARDIAN", "Guardian"),
    ]

    reference = models.CharField(max_length=20, unique=True, editable=False)

    # Child
    child_name = models.CharField(max_length=120)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    class_applying = models.CharField(max_length=80)
    previous_school = models.CharField(max_length=180, blank=True)

    # Parent / guardian
    parent_name = models.CharField(max_length=120)
    relation = models.CharField(max_length=12, choices=RELATION_CHOICES, default="MOTHER")
    phone = models.CharField(max_length=20)
    alternate_phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=80, blank=True, default="Panchkula")

    # Meta
    message = models.TextField(blank=True)
    preferred_contact = models.CharField(max_length=20, blank=True, default="Phone")
    needs_transport = models.BooleanField(default=False)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default=STATUS_NEW)
    admin_notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Admissions"

    def __str__(self):
        return f"{self.child_name} ({self.reference})"

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self._make_reference()
        super().save(*args, **kwargs)

    def _make_reference(self):
        base = "TT"
        tail = f"{self.child_name[:2].upper()}{self.pk or 0:04d}"
        candidate = f"{base}-{tail}"
        counter = 1
        qs = Admission.objects.exclude(pk=self.pk)
        while qs.filter(reference=candidate).exists():
            counter += 1
            candidate = f"{base}-{tail}-{counter}"
        return candidate


class ContactMessage(TimeStamped):
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    subject = models.CharField(max_length=160, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.subject or 'Enquiry'}"


# --------------------------------------------------------------------------- #
# Social proof
# --------------------------------------------------------------------------- #
class Testimonial(TimeStamped):
    parent_name = models.CharField(max_length=120)
    child_class = models.CharField(max_length=60, blank=True)
    quote = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.parent_name} ({self.child_class})"


class FAQ(TimeStamped):
    question = models.CharField(max_length=250)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"

    def __str__(self):
        return self.question