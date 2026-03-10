from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
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
from .serializers import (
    UserSerializer,
    CourseListSerializer,
    CourseDetailSerializer,
    EnrollmentSerializer,
    ModuleSerializer,
    AssignmentSerializer,
    SubmissionSerializer,
    GradeSerializer,
    AnnouncementSerializer,
    DiscussionSerializer,
    CommentSerializer,
)


class IsTeacherOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow teachers to edit"""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role in [
            "teacher",
            "admin",
        ]


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model"""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=["get"])
    def me(self, request):
        """Get current user info"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for Course model"""

    queryset = Course.objects.filter(status="published")
    permission_classes = [IsTeacherOrReadOnly]

    def get_serializer_class(self):
        if self.action == "list":
            return CourseListSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_authenticated:
            if user.role == "teacher":
                # Teachers see courses they teach
                queryset = Course.objects.filter(instructor=user)
            elif user.role == "student":
                # Students can see their enrolled courses or all published courses
                enrolled = self.request.query_params.get("enrolled")
                if enrolled == "true":
                    queryset = Course.objects.filter(
                        enrollments__student=user, enrollments__status="active"
                    )

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)

    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        """Enroll current user in course"""
        course = self.get_object()
        user = request.user

        if user.role != "student":
            return Response(
                {"error": "Only students can enroll in courses"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        enrollment, created = Enrollment.objects.get_or_create(
            student=user, course=course, defaults={"status": "active"}
        )

        if not created and enrollment.status == "dropped":
            enrollment.status = "active"
            enrollment.save()

        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def unenroll(self, request, pk=None):
        """Unenroll current user from course"""
        course = self.get_object()
        enrollment = get_object_or_404(Enrollment, student=request.user, course=course)
        enrollment.status = "dropped"
        enrollment.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class EnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Enrollment model"""

    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "student":
            return Enrollment.objects.filter(student=user)
        elif user.role == "teacher":
            return Enrollment.objects.filter(course__instructor=user)
        return Enrollment.objects.all()

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class ModuleViewSet(viewsets.ModelViewSet):
    """ViewSet for Module model"""

    serializer_class = ModuleSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        queryset = Module.objects.all()
        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)

        # Students only see published modules
        if self.request.user.role == "student":
            queryset = queryset.filter(is_published=True)

        return queryset


class AssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for Assignment model"""

    serializer_class = AssignmentSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        queryset = Assignment.objects.all()
        course_id = self.request.query_params.get("course")
        module_id = self.request.query_params.get("module")

        if course_id:
            queryset = queryset.filter(module__course_id=course_id)
        if module_id:
            queryset = queryset.filter(module_id=module_id)

        # Students only see published assignments
        if self.request.user.role == "student":
            queryset = queryset.filter(
                is_published=True, available_from__lte=timezone.now()
            )

        return queryset

    @action(detail=True, methods=["get"])
    def submissions(self, request, pk=None):
        """Get all submissions for an assignment (teachers only)"""
        assignment = self.get_object()

        if request.user.role != "teacher":
            return Response(
                {"error": "Only teachers can view all submissions"},
                status=status.HTTP_403_FORBIDDEN,
            )

        submissions = assignment.submissions.all()
        serializer = SubmissionSerializer(submissions, many=True)
        return Response(serializer.data)


class SubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet for Submission model"""

    serializer_class = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Submission.objects.all()

        if user.role == "student":
            # Students only see their own submissions
            queryset = queryset.filter(student=user)
        elif user.role == "teacher":
            # Teachers see submissions for their courses
            queryset = queryset.filter(assignment__module__course__instructor=user)

        assignment_id = self.request.query_params.get("assignment")
        if assignment_id:
            queryset = queryset.filter(assignment_id=assignment_id)

        return queryset

    def perform_create(self, serializer):
        assignment_id = self.request.data.get("assignment_id")
        assignment = get_object_or_404(Assignment, id=assignment_id)

        # Check if submission is late
        is_late = timezone.now() > assignment.due_date
        submission_status = "late" if is_late else "submitted"

        # Get attempt number
        attempt = (
            Submission.objects.filter(
                assignment=assignment, student=self.request.user
            ).count()
            + 1
        )

        serializer.save(
            student=self.request.user, status=submission_status, attempt_number=attempt
        )


class GradeViewSet(viewsets.ModelViewSet):
    """ViewSet for Grade model"""

    serializer_class = GradeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Grade.objects.all()

        if user.role == "student":
            # Students only see their own grades
            queryset = queryset.filter(submission__student=user)
        elif user.role == "teacher":
            # Teachers see grades for their courses
            queryset = queryset.filter(
                submission__assignment__module__course__instructor=user
            )

        return queryset

    def perform_create(self, serializer):
        if self.request.user.role not in ["teacher", "admin"]:
            return Response(
                {"error": "Only teachers can create grades"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save(graded_by=self.request.user)


class AnnouncementViewSet(viewsets.ModelViewSet):
    """ViewSet for Announcement model"""

    serializer_class = AnnouncementSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_queryset(self):
        queryset = Announcement.objects.all()
        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class DiscussionViewSet(viewsets.ModelViewSet):
    """ViewSet for Discussion model"""

    serializer_class = DiscussionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Discussion.objects.all()
        course_id = self.request.query_params.get("course")
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    """ViewSet for Comment model"""

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.all()
        discussion_id = self.request.query_params.get("discussion")
        if discussion_id:
            queryset = queryset.filter(discussion_id=discussion_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
