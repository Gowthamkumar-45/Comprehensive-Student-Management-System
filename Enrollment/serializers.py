from rest_framework import serializers
from .models import Enrollment

class EnrollmentSerializer(serializers.ModelSerializer):
    selected_course_name = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = '__all__'

    def get_selected_course_name(self, obj):
        return obj.selected_course.title if obj.selected_course else "N/A"

