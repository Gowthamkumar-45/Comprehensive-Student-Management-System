import json
from django.http import JsonResponse
from Users.models import User
from Courses.models import Course
from Enrollment.models import Enrollment
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from datetime import datetime
import calendar

def dashboard_stats_view(request):
    try:
        # 1. Total Students
        total_students = User.objects.filter(role='student').count()
        # Active vs Inactive logic
        total_students_active = User.objects.filter(role='student', is_active=True).count()
        
        # Trend logic (mocking a trend comparing last month for now, ideally needs a date_joined filter)
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)
        
        students_this_month = User.objects.filter(role='student', date_joined__gte=thirty_days_ago).count()
        students_last_month = User.objects.filter(role='student', date_joined__gte=sixty_days_ago, date_joined__lt=thirty_days_ago).count()
        
        student_trend = 0
        if students_last_month > 0:
            student_trend = ((students_this_month - students_last_month) / students_last_month) * 100
        elif students_this_month > 0:
            student_trend = 100

        # 2. Active Courses
        total_courses = Course.objects.count()
        courses_this_month = Course.objects.filter(created_at__gte=thirty_days_ago).count()
        courses_last_month = Course.objects.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
        
        course_trend = 0
        if courses_last_month > 0:
            course_trend = ((courses_this_month - courses_last_month) / courses_last_month) * 100
        elif courses_this_month > 0:
            course_trend = 100

        # 3. Total Teachers
        total_teachers = User.objects.filter(role='teacher').count()
        teachers_this_month = User.objects.filter(role='teacher', date_joined__gte=thirty_days_ago).count()
        teachers_last_month = User.objects.filter(role='teacher', date_joined__gte=sixty_days_ago, date_joined__lt=thirty_days_ago).count()
        
        teacher_trend = 0
        if teachers_last_month > 0:
            teacher_trend = ((teachers_this_month - teachers_last_month) / teachers_last_month) * 100
        elif teachers_this_month > 0:
            teacher_trend = 100

        # 4. Total Enrollments / Revenue Proxy via enrollments count
        total_enrollments = Enrollment.objects.count()
        enrollments_this_month = Enrollment.objects.filter(created_at__gte=thirty_days_ago).count()
        enrollments_last_month = Enrollment.objects.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
        
        enrollment_trend = 0
        if enrollments_last_month > 0:
            enrollment_trend = ((enrollments_this_month - enrollments_last_month) / enrollments_last_month) * 100
        elif enrollments_this_month > 0:
            enrollment_trend = 100
        
        # 5. Chart Data (Monthly registrations over 6 months)
        six_months_ago = now - timedelta(days=6 * 30)
        
        # Group Enrollments by Month
        enrollments_by_month = (
            Enrollment.objects
            .filter(created_at__gte=six_months_ago)
            .annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        chart_data = []

        # Ensure last 6 months are filled even with 0
        for i in range(5, -1, -1):
            target_date = now - timedelta(days=i * 30)
            month_name = calendar.month_abbr[target_date.month]
            
            # Find in our query
            val = 0
            for row in enrollments_by_month:
                if row['month'].month == target_date.month and row['month'].year == target_date.year:
                    val = row['count']
                    break
                    
            chart_data.append({
                "name": month_name,
                "students": val, # Enrollments
                "revenue": val * 1000 # Mock revenue logic: 1 enrollment = $1000 roughly for display
            })

        return JsonResponse({
            "success": True,
            "stats": {
                "students": { "value": total_students, "trend": round(student_trend, 1) },
                "courses": { "value": total_courses, "trend": round(course_trend, 1) },
                "teachers": { "value": total_teachers, "trend": round(teacher_trend, 1) },
                # Using enrollments count * 1000 as mock revenue for now since we don't have a payments model
                "revenue": { "value": total_enrollments * 1000, "trend": round(enrollment_trend, 1) }
            },
            "chart_data": chart_data
        })
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


def dashboard_recent_activity_view(request):
    try:
        recent_enrollments = Enrollment.objects.select_related('selected_course').order_by('-created_at')[:5]
        
        activity = []
        for enc in recent_enrollments:
            course_title = enc.selected_course.title if enc.selected_course else "Unknown Course"
            
            # Format time elapsed
            now = timezone.now()
            diff = now - enc.created_at
            
            if diff.days > 0:
                time_str = f"{diff.days} days ago"
            elif diff.seconds >= 3600:
                time_str = f"{diff.seconds // 3600} hours ago"
            elif diff.seconds >= 60:
                time_str = f"{diff.seconds // 60} mins ago"
            else:
                time_str = "Just now"

            activity.append({
                "id": enc.id,
                "name": enc.full_name,
                "action": f"Enrolled in {course_title}",
                "time": time_str
            })
            
        return JsonResponse({"success": True, "activity": activity})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

def dashboard_academic_stats_view(request):
    try:
        # Real Data: Total Students
        total_students = User.objects.filter(role='student').count()
        
        # Real Data: Active Curriculums (Courses)
        active_curriculums = Course.objects.count()
        
        # Mock Data: Avg. Attendance, Ongoing Exams
        avg_attendance = 88
        ongoing_exams = 12
        
        # Mock Data: Attendance Trends
        attendance_data = [
            {"month": "Jan", "rate": 85},
            {"month": "Feb", "rate": 88},
            {"month": "Mar", "rate": 86},
            {"month": "Apr", "rate": 91},
            {"month": "May", "rate": 89},
            {"month": "Jun", "rate": 93},
        ]
        
        # Mock Data: Performance Grade Distribution
        performance_data = [
            {"grade": "A", "count": int(total_students * 0.3) if total_students > 0 else 400},
            {"grade": "B", "count": int(total_students * 0.4) if total_students > 0 else 550},
            {"grade": "C", "count": int(total_students * 0.15) if total_students > 0 else 200},
            {"grade": "D", "count": int(total_students * 0.1) if total_students > 0 else 80},
            {"grade": "F", "count": int(total_students * 0.05) if total_students > 0 else 20},
        ]
        
        return JsonResponse({
            "success": True,
            "stats": {
                "totalStudents": total_students,
                "avgAttendance": avg_attendance,
                "ongoingExams": ongoing_exams,
                "activeCurriculums": active_curriculums
            },
            "attendanceData": attendance_data,
            "performanceData": performance_data
        })
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
