from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email'] 
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'write_only': True}
        }

    def validate(self, data):
        data['email'] = data['email'].lower()
        data['username'] = data['username'].lower()

        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError('Email already exists')
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError('Username already exists')
        return data
    
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token