from django.contrib import admin
from django.urls import path

from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/room/', views.room),
    path('api/plan/', views.plan),
    path('api/verify/', views.verify),
    path('api/leaderboard/', views.leaderboard),
    path('api/score/', views.score),
    path('api/chat/', views.chat),
]
