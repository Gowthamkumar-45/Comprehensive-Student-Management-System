from django.db import models
from Courses.models import Course

class Enrollment(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
    MODE_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
    ]

    # Personal Details
    full_name = models.CharField(max_length=255)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    contact_number = models.CharField(max_length=15)
    email = models.EmailField()
    residential_address = models.TextField()

    # Educational Details
    previous_qualification = models.CharField(max_length=100)
    marks_percentage_cgpa = models.CharField(max_length=50)
    passing_year = models.IntegerField()
    school_college_name = models.CharField(max_length=255)
    certificates = models.FileField(upload_to='enrollment/certificates/', blank=True, null=True)

    # Course Details
    # Linking to existing Course model if possible, else CharField
    selected_course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, related_name='enrollments')
    course_duration = models.CharField(max_length=100)
    batch_timing = models.CharField(max_length=100)
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, default='offline')

    # Identity & Verification Documents
    id_proof = models.FileField(upload_to='enrollment/id_proofs/')
    passport_photo = models.ImageField(upload_to='enrollment/photos/')
    transfer_certificate = models.FileField(upload_to='enrollment/tc/', blank=True, null=True)

    # Emergency Contact
    guardian_name = models.CharField(max_length=255)
    guardian_contact = models.CharField(max_length=15)

    # Metadata
    status = models.CharField(max_length=20, default='pending') # pending, approved, rejected
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.selected_course.title if self.selected_course else 'No Course'}"
