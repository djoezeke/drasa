from rest_framework import serializers
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


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "bio",
            "avatar",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for course lists"""

    instructor_name = serializers.CharField(
        source="instructor.get_full_name", read_only=True
    )
    enrollment_count = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "code",
            "description",
            "instructor",
            "instructor_name",
            "status",
            "start_date",
            "end_date",
            "cover_image",
            "enrollment_count",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status="active").count()


class CourseDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for single course view"""

    instructor = UserSerializer(read_only=True)
    modules = serializers.SerializerMethodField()
    enrollment_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            "id",
            "title",
            "code",
            "description",
            "instructor",
            "status",
            "start_date",
            "end_date",
            "syllabus",
            "cover_image",
            "modules",
            "enrollment_count",
            "is_enrolled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_modules(self, obj):
        modules = obj.modules.filter(is_published=True)
        return ModuleSerializer(modules, many=True).data

    def get_enrollment_count(self, obj):
        return obj.enrollments.filter(status="active").count()

    def get_is_enrolled(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            return obj.enrollments.filter(
                student=request.user, status="active"
            ).exists()
        return False


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer for Enrollment model"""

    course = CourseListSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    course_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Enrollment
        fields = [
            "id",
            "student",
            "course",
            "course_id",
            "status",
            "enrolled_at",
            "completed_at",
        ]
        read_only_fields = ["id", "enrolled_at"]


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer for Assignment model"""

    module_title = serializers.CharField(source="module.title", read_only=True)
    course_code = serializers.CharField(source="module.course.code", read_only=True)
    submission_status = serializers.SerializerMethodField()

    class Meta:
        model = Assignment
        fields = [
            "id",
            "module",
            "module_title",
            "course_code",
            "title",
            "description",
            "submission_type",
            "points_possible",
            "due_date",
            "available_from",
            "available_until",
            "is_published",
            "allow_late_submission",
            "submission_status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_submission_status(self, obj):
        request = self.context.get("request")
        if request and hasattr(request, "user") and request.user.is_authenticated:
            submission = obj.submissions.filter(student=request.user).first()
            if submission:
                return {
                    "submitted": True,
                    "status": submission.status,
                    "submitted_at": submission.submitted_at,
                    "has_grade": hasattr(submission, "grade"),
                }
        return {"submitted": False}


class ModuleSerializer(serializers.ModelSerializer):
    """Serializer for Module model"""

    assignments = AssignmentSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = [
            "id",
            "course",
            "title",
            "description",
            "order",
            "is_published",
            "assignments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for Submission model"""

    assignment = AssignmentSerializer(read_only=True)
    student = UserSerializer(read_only=True)
    assignment_id = serializers.IntegerField(write_only=True)
    grade_info = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            "id",
            "assignment",
            "assignment_id",
            "student",
            "content",
            "file_url",
            "submitted_at",
            "status",
            "attempt_number",
            "grade_info",
        ]
        read_only_fields = ["id", "submitted_at", "student"]

    def get_grade_info(self, obj):
        if hasattr(obj, "grade"):
            return {
                "score": obj.grade.score,
                "feedback": obj.grade.feedback,
                "graded_at": obj.grade.graded_at,
            }
        return None


class GradeSerializer(serializers.ModelSerializer):
    """Serializer for Grade model"""

    submission = SubmissionSerializer(read_only=True)
    graded_by = UserSerializer(read_only=True)
    submission_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Grade
        fields = [
            "id",
            "submission",
            "submission_id",
            "score",
            "feedback",
            "graded_by",
            "graded_at",
            "updated_at",
        ]
        read_only_fields = ["id", "graded_by", "graded_at", "updated_at"]


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for Announcement model"""

    author = UserSerializer(read_only=True)
    course_code = serializers.CharField(source="course.code", read_only=True)

    class Meta:
        model = Announcement
        fields = [
            "id",
            "course",
            "course_code",
            "author",
            "title",
            "content",
            "is_pinned",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model"""

    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "discussion",
            "author",
            "content",
            "parent",
            "replies",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return []


class DiscussionSerializer(serializers.ModelSerializer):
    """Serializer for Discussion model"""

    author = UserSerializer(read_only=True)
    course_code = serializers.CharField(source="course.code", read_only=True)
    comments_count = serializers.SerializerMethodField()
    top_level_comments = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = [
            "id",
            "course",
            "course_code",
            "author",
            "title",
            "content",
            "is_pinned",
            "is_locked",
            "comments_count",
            "top_level_comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "created_at", "updated_at"]

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_top_level_comments(self, obj):
        comments = obj.comments.filter(parent=None)[:10]
        return CommentSerializer(comments, many=True).data
