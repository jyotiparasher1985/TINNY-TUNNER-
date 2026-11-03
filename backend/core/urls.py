from django.urls import path

from . import crud, views

urlpatterns = [
    # Public content
    path("settings/", views.site_settings, name="site-settings"),
    path("settings/update/", views.update_settings, name="settings-update"),

    # Generic CRUD for editable content (admin)
    path("crud/meta/", crud.crud_meta, name="crud-meta"),
    path("crud/<slug:slug>/", crud.crud_list, name="crud-list"),
    path("crud/<slug:slug>/create/", crud.crud_create, name="crud-create"),
    path("crud/<slug:slug>/<int:pk>/", crud.crud_detail, name="crud-detail"),
    path("upload/", crud.upload_image, name="upload-image"),
    path("home/", views.home, name="home"),
    path("programs/", views.programs, name="programs"),
    path("facilities/", views.facilities, name="facilities"),
    path("gallery/", views.gallery, name="gallery"),
    path("posts/", views.posts, name="posts"),
    path("posts/<slug:slug>/", views.post_detail, name="post-detail"),
    path("testimonials/", views.testimonials, name="testimonials"),
    path("faqs/", views.faqs, name="faqs"),

    # Editable page content (public)
    path("hero-slides/", views.hero_slides, name="hero-slides"),
    path("difference-cards/", views.difference_cards, name="difference-cards"),
    path("value-cards/", views.value_cards, name="value-cards"),
    path("timeline-items/", views.timeline_items, name="timeline-items"),
    path("team-members/", views.team_members, name="team-members"),
    path("approach-cards/", views.approach_cards, name="approach-cards"),
    path("daily-routine/", views.daily_routine, name="daily-routine"),
    path("safety-items/", views.safety_items, name="safety-items"),
    path("timing-rows/", views.timing_rows, name="timing-rows"),
    path("page-content/", views.page_content, name="page-content"),

    # Write
    path("admissions/apply/", views.apply_admission, name="apply-admission"),
    path("contact/", views.contact, name="contact"),

    # Admin API
    path("admissions/", views.admission_list, name="admission-list"),
    path("admissions/<int:pk>/update/", views.admission_update, name="admission-update"),

    # Session auth for the React admin panel
    path("auth/login/", views.auth_login, name="auth-login"),
    path("auth/logout/", views.auth_logout, name="auth-logout"),
    path("auth/me/", views.auth_me, name="auth-me"),
]