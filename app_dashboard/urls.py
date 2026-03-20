from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats_view, name='dashboard-stats'),
    path('recent-activity/', views.dashboard_recent_activity_view, name='dashboard-recent-activity'),
    path('academic-stats/', views.dashboard_academic_stats_view, name='dashboard-academic-stats'),
]
