from django.urls import path
from .views import PomodoroSettingsView

urlpatterns = [
    path('settings/', PomodoroSettingsView.as_view(), name='settings')
]