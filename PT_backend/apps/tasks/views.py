from django.shortcuts import render
from django.db.models import F
from rest_framework.response import Response
from rest_framework import permissions, generics, status
from .models import Task
from .serializers import TaskSerializer

# Create your views here.

class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self): # This method is used to filter the queryset based on the user that is currently logged in.
        return Task.objects.filter(user=self.request.user) # This method is used to filter the queryset based on the user that is currently logged in.

    def create(self, request, *args, **kwargs): # limit number of tasks to 10
        if Task.objects.filter(user=self.request.user).count() >= 10:
            return Response({'message': 'You have reached the maximum number of tasks allowed'}, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)
    
    def perform_create(self, serializer): # This method is used to set the user field to the currently logged in user.
        user_tasks = Task.objects.filter(user=self.request.user)
        position = user_tasks.last().position + 1 if user_tasks.exists() else 0
        serializer.save(user=self.request.user, position=position)
    
    # This method is used to update the position of the remaining tasks after a task is deleted.
    def perform_destroy(self, instance):
        user = self.request.user
        instance.delete()
        self.reorder_tasks(user)
        
    def reorder_tasks(self, user):
        tasks = Task.objects.filter(user=user).order_by('position')
        for index, task in enumerate(tasks):
            task.position = index
            task.save()


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self): # This method is used to filter the queryset based on the user that is currently logged in.
        return Task.objects.filter(user=self.request.user) # This method is used to filter the queryset based on the user that is currently logged in.
    


