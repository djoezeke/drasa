from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Extended user model for LMS"""

    USER_ROLES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]
    role = models.CharField(max_length=20, choices=USER_ROLES, default="student")
    bio = models.TextField(blank=True)
    avatar = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Course(models.Model):
    """Course model"""

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    instructor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="taught_courses"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    start_date = models.DateField()
    end_date = models.DateField()
    syllabus = models.TextField(blank=True)
    cover_image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.code} - {self.title}"


class Enrollment(models.Model):
    """Student enrollment in courses"""

    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("dropped", "Dropped"),
    ]

    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="enrollments"
    )
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="enrollments"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    enrolled_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ["student", "course"]
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.student.username} - {self.course.code}"


class Module(models.Model):
    """Course modules/sections"""

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["course", "order"]

    def __str__(self):
        return f"{self.course.code} - {self.title}"


class Assignment(models.Model):
    """Course assignments"""

    SUBMISSION_TYPES = [
        ("online_text", "Online Text Entry"),
        ("file_upload", "File Upload"),
        ("url", "Website URL"),
    ]

    module = models.ForeignKey(
        Module, on_delete=models.CASCADE, related_name="assignments"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    submission_type = models.CharField(max_length=20, choices=SUBMISSION_TYPES)
    points_possible = models.IntegerField(validators=[MinValueValidator(0)])
    due_date = models.DateTimeField()
    available_from = models.DateTimeField()
    available_until = models.DateTimeField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    allow_late_submission = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["module", "due_date"]

    def __str__(self):
        return f"{self.module.course.code} - {self.title}"


class Submission(models.Model):
    """Student assignment submissions"""

    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("graded", "Graded"),
        ("returned", "Returned"),
        ("late", "Late"),
    ]

    assignment = models.ForeignKey(
        Assignment, on_delete=models.CASCADE, related_name="submissions"
    )
    student = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="submissions"
    )
    content = models.TextField(blank=True)
    file_url = models.URLField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="submitted"
    )
    attempt_number = models.IntegerField(default=1)

    class Meta:
        unique_together = ["assignment", "student", "attempt_number"]
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"{self.student.username} - {self.assignment.title}"


class Grade(models.Model):
    """Grades for submissions"""

    submission = models.OneToOneField(
        Submission, on_delete=models.CASCADE, related_name="grade"
    )
    score = models.FloatField(validators=[MinValueValidator(0)])
    feedback = models.TextField(blank=True)
    graded_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="graded_submissions"
    )
    graded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.submission.student.username} - {self.score}/{self.submission.assignment.points_possible}"


class Announcement(models.Model):
    """Course announcements"""

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="announcements"
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="announcements"
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self):
        return f"{self.course.code} - {self.title}"


class Discussion(models.Model):
    """Discussion forums"""

    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="discussions"
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="discussions"
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self):
        return f"{self.course.code} - {self.title}"


class Comment(models.Model):
    """Comments on discussions"""

    discussion = models.ForeignKey(
        Discussion, on_delete=models.CASCADE, related_name="comments"
    )
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author.username} on {self.discussion.title}"
