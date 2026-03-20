from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Enrollment
from .serializers import EnrollmentSerializer
from rest_framework.permissions import AllowAny

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [AllowAny] # Allow students to enroll without login if needed, or adjust as per requirement

    def create(self, request, *args, **kwargs):
        # Handle file uploads specifically if needed, though ModelViewSet handles it via serializer
        return super().create(request, *args, **kwargs)
