from rest_framework import serializers
from notes.models import Note
from users.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class NotesSerializer(serializers.ModelSerializer):
  class Meta:
    model = Note
    fields = ('id', 'title', 'content', 'created_date', 'updated_date')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ("id", "username", "email")

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(max_length=68, min_length=8, style={'input_type': 'password'}, write_only=True)
  password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password', 'password2')

  def validate(self, attrs):
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({'password': 'Password field didn\'t match.'})
    return attrs

  def create(self, validated_data):
    password = validated_data.pop('password')
    validated_data.pop('password2')

    user = User.objects.create_user(**validated_data)
    user.set_password(password)
    user.save()
    return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  @classmethod
  def get_token(cls, user):
    token = super().get_token(user)

    token['username'] = user.username
    
    return token
