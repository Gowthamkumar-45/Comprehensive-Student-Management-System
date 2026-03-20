from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField() # Short description
    full_description = models.TextField(blank=True, null=True)
    duration = models.CharField(max_length=100)
    level = models.CharField(max_length=100, default='Undergraduate')
    category = models.CharField(max_length=100)
    image = models.ImageField(upload_to='course_images/', blank=True, null=True)
    
    # Highlights fields
    who_is_it_for = models.TextField(blank=True, null=True)
    why_take_this = models.TextField(blank=True, null=True)
    what_you_will_learn = models.JSONField(default=list, blank=True)
    
    # Advanced data
    opportunities = models.JSONField(default=list, blank=True)
    faqs = models.JSONField(default=list, blank=True)
    modules = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
