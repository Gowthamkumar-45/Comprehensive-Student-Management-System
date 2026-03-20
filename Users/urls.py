from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/',views.login_view,name="login"),
    path('create-user/', views.create_user_view, name="create_user"),
    path('list/', views.list_users_view, name="list_users"),
]