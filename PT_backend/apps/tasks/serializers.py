from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        queryset = Task.objects.all()
        model = Task
        fields = ['id', 'user', 'title', 'text', 'created_at', 'updated_at', 'completed', 'position']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
        

