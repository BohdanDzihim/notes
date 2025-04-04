from rest_framework import serializers
from notes.models import Note
from users.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

class NotesSerializer(serializers.ModelSerializer):
  class Meta:
    model = Note
    fields = ('id', 'title', 'content', 'created_date', 'updated_date')

class RegisterSerializer(serializers.ModelSerializer):
  password = serializers.CharField(max_length=68, min_length=8, style={'input_type': 'password'}, write_only=True)
  password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'password', 'password2')

  def validate(self, attrs):
    email = attrs.get('email', '')
    username = attrs.get('username', '')
    if not username.isalnum():
      raise serializers.ValidationError(self.default_error_messages)
    if attrs['password'] != attrs['password2']:
      raise serializers.ValidationError({'password': 'Password field didn\'t match.'})
    return attrs

  def create(self, validated_data):
    user = User.objects.create_user(
      username=validated_data['username'],
      email=validated_data['email'],
      password=validated_data['password'],
    )
    return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        return {"username": user.username}

class LogoutSerializer(serializers.Serializer):
  refresh = serializers.CharField()
  def validate(self, attrs):
    self.token = attrs['refresh']
    return attrs
  def save(self, **kwargs):
    try:
      RefreshToken(self.token).blacklist()
    except TokenError:
      self.fail('bad_token')

