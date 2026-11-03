from django.urls import path

from . import views

urlpatterns = [
    # Public content
    path("settings/", views.site_settings, name="site-settings"),
    path("settings/update/", views.update_settings, name="settings-update"),
    path("home/", views.home, name="home"),
    path("programs/", views.programs, name="programs"),
    path("facilities/", views.facilities, name="facilities"),
    path("gallery/", views.gallery, name="gallery"),
    path("posts/", views.posts, name="posts"),
    path("posts/<slug:slug>/", views.post_detail, name="post-detail"),
    path("testimonials/", views.testimonials, name="testimonials"),
    path("faqs/", views.faqs, name="faqs"),

    # Write
    path("admissions/apply/", views.apply_admission, name="apply-admission"),
    path("contact/", views.contact, name="contact"),

    # Admin API
    path("admissions/", views.admission_list, name="admission-list"),
    path("admissions/<int:pk>/update/", views.admission_update, name="admission-update"),
]