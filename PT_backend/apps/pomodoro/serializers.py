from rest_framework import serializers
from .models import PomodoroSettings

class PomodoroSettingsSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PomodoroSettings
        fields = ['user_id', 'username', 'pomodoro_minutes', 'pomodoro_seconds', 
                  'short_break_minutes', 'short_break_seconds', 
                  'long_break_minutes', 'long_break_seconds', 
                  'long_break_after_limit', 'current_session_count', 
                  'pomodoro_sessions_all_time_count', 
                  'sound', 'pomodoro_sound', 
                  'short_break_sound', 'long_break_sound', 
                  'auto_start', 'theme']
