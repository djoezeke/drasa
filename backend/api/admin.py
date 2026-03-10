from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User,
    Course,
    Enrollment,
    Module,
    Assignment,
    Submission,
    Grade,
    Announcement,
    Discussion,
    Comment,
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["username", "email", "role", "first_name", "last_name", "is_staff"]
    list_filter = ["role", "is_staff", "is_active"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("LMS Info", {"fields": ("role", "bio", "avatar")}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("LMS Info", {"fields": ("role", "bio", "avatar")}),
    )


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ["code", "title", "instructor", "status", "start_date", "end_date"]
    list_filter = ["status", "start_date"]
    search_fields = ["code", "title", "instructor__username"]
    date_hierarchy = "start_date"


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ["student", "course", "status", "enrolled_at"]
    list_filter = ["status", "enrolled_at"]
    search_fields = ["student__username", "course__code"]
    date_hierarchy = "enrolled_at"


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "order", "is_published"]
    list_filter = ["is_published", "course"]
    search_fields = ["title", "course__code"]
    ordering = ["course", "order"]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ["title", "module", "points_possible", "due_date", "is_published"]
    list_filter = ["is_published", "submission_type", "due_date"]
    search_fields = ["title", "module__title", "module__course__code"]
    date_hierarchy = "due_date"


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ["student", "assignment", "status", "submitted_at", "attempt_number"]
    list_filter = ["status", "submitted_at"]
    search_fields = ["student__username", "assignment__title"]
    date_hierarchy = "submitted_at"


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ["submission", "score", "graded_by", "graded_at"]
    list_filter = ["graded_at"]
    search_fields = ["submission__student__username", "submission__assignment__title"]
    date_hierarchy = "graded_at"


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "author", "is_pinned", "created_at"]
    list_filter = ["is_pinned", "created_at", "course"]
    search_fields = ["title", "content", "course__code"]
    date_hierarchy = "created_at"


@admin.register(Discussion)
class DiscussionAdmin(admin.ModelAdmin):
    list_display = ["title", "course", "author", "is_pinned", "is_locked", "created_at"]
    list_filter = ["is_pinned", "is_locked", "created_at", "course"]
    search_fields = ["title", "content", "course__code"]
    date_hierarchy = "created_at"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["author", "discussion", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["content", "author__username", "discussion__title"]
    date_hierarchy = "created_at"
