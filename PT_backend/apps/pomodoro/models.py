from django.db import models
from apps.account.models import CustomUser
from django.core.exceptions import ValidationError
# Create your models here.

# this model will store all the pomodoro settings and preferences of the user
class PomodoroSettings(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('system', 'System'),
    ]

    SOUND_CHOICES = [
        ('alarm', 'Alarm'),
        ('melody', 'Melody'),
        ('chime', 'Chime'),
        ('silence', 'Silence'),
    ]

    SESSION_STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('stopped', 'Stopped'),
    ]

    session_status = models.CharField(max_length=10, choices=SESSION_STATUS_CHOICES, default='stopped')

    pomodoro_minutes = models.IntegerField(default=25, blank=False, null=False)
    pomodoro_seconds = models.IntegerField(default=0, blank=False, null=False)
    
    short_break_minutes = models.IntegerField(default=5, blank=False, null=False)
    short_break_seconds = models.IntegerField(default=0, blank=False, null=False)
    
    long_break_minutes = models.IntegerField(default=15, blank=False, null=False)
    long_break_seconds = models.IntegerField(default=0, blank=False, null=False)

    long_break_after_limit = models.IntegerField(default=4, blank=False, null=False)
    current_session_count = models.IntegerField(default=0, blank=False, null=False)
    pomodoro_sessions_all_time_count = models.IntegerField(default=0, blank=False, null=False)

    sound = models.BooleanField(default=True)
    pomodoro_sound = models.CharField(max_length=10, choices=SOUND_CHOICES, default='alarm')
    short_break_sound = models.CharField(max_length=10, choices=SOUND_CHOICES, default='melody')
    long_break_sound = models.CharField(max_length=10, choices=SOUND_CHOICES, default='melody')

    auto_start = models.BooleanField(default=False)
    theme = models.CharField(max_length=6, choices=THEME_CHOICES, default='system')


    def clean(self):
        super().clean()
        # Validate pomodoro time
        if self.pomodoro_minutes < 0 or self.pomodoro_seconds < 0 or self.pomodoro_seconds >= 60:
            raise ValidationError("Pomodoro time must be non-negative and seconds must be between 0 and 59.")
        # Validate short break time
        if self.short_break_minutes < 0 or self.short_break_seconds < 0 or self.short_break_seconds >= 60:
            raise ValidationError("Short break time must be non-negative and seconds must be between 0 and 59.")
        # Validate long break time
        if self.long_break_minutes < 0 or self.long_break_seconds < 0 or self.long_break_seconds >= 60:
            raise ValidationError("Long break time must be non-negative and seconds must be between 0 and 59.")
        # Validate long break after limit
        if self.long_break_after_limit <= 0:
            raise ValidationError("Long break after limit must be positive.")
        
    def __str__(self):
        return self.user.username