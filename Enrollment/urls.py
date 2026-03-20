from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnrollmentViewSet

router = DefaultRouter()
router.register(r'submit', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
