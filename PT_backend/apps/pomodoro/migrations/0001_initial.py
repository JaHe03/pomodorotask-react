# Generated by Django 5.1.7 on 2025-03-08 06:32

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PomodoroSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_status', models.CharField(choices=[('active', 'Active'), ('paused', 'Paused'), ('stopped', 'Stopped')], default='stopped', max_length=10)),
                ('pomodoro_minutes', models.IntegerField(default=25)),
                ('pomodoro_seconds', models.IntegerField(default=0)),
                ('short_break_minutes', models.IntegerField(default=5)),
                ('short_break_seconds', models.IntegerField(default=0)),
                ('long_break_minutes', models.IntegerField(default=15)),
                ('long_break_seconds', models.IntegerField(default=0)),
                ('long_break_after_limit', models.IntegerField(default=4)),
                ('current_session_count', models.IntegerField(default=0)),
                ('pomodoro_sessions_all_time_count', models.IntegerField(default=0)),
                ('sound', models.BooleanField(default=True)),
                ('pomodoro_sound', models.CharField(choices=[('alarm', 'Alarm'), ('melody', 'Melody'), ('chime', 'Chime'), ('silence', 'Silence')], default='alarm', max_length=10)),
                ('short_break_sound', models.CharField(choices=[('alarm', 'Alarm'), ('melody', 'Melody'), ('chime', 'Chime'), ('silence', 'Silence')], default='melody', max_length=10)),
                ('long_break_sound', models.CharField(choices=[('alarm', 'Alarm'), ('melody', 'Melody'), ('chime', 'Chime'), ('silence', 'Silence')], default='melody', max_length=10)),
                ('auto_start', models.BooleanField(default=False)),
                ('theme', models.CharField(choices=[('light', 'Light'), ('dark', 'Dark'), ('system', 'System')], default='system', max_length=6)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
