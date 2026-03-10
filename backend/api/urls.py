from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    CourseViewSet,
    EnrollmentViewSet,
    ModuleViewSet,
    AssignmentViewSet,
    SubmissionViewSet,
    GradeViewSet,
    AnnouncementViewSet,
    DiscussionViewSet,
    CommentViewSet,
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollment")
router.register(r"modules", ModuleViewSet, basename="module")
router.register(r"assignments", AssignmentViewSet, basename="assignment")
router.register(r"submissions", SubmissionViewSet, basename="submission")
router.register(r"grades", GradeViewSet, basename="grade")
router.register(r"announcements", AnnouncementViewSet, basename="announcement")
router.register(r"discussions", DiscussionViewSet, basename="discussion")
router.register(r"comments", CommentViewSet, basename="comment")

urlpatterns = [
    path("", include(router.urls)),
]
