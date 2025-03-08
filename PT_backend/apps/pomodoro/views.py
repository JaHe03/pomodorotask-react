from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import PomodoroSettingsSerializer
from .models import PomodoroSettings 
# Create your views here.

class PomodoroSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = PomodoroSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_
