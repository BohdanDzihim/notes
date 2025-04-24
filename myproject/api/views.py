from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from notes.models import Note
from .serializers import NotesSerializer, RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from storages.backends.s3boto3 import S3Boto3Storage
from datetime import timedelta
from django.utils import timezone
from .mypaginations import MyLimitOffsetPagination
import re, boto3
from django.conf import settings

AWS_STORAGE_BUCKET_NAME = 's3-bucket-for-notes-app'

# Create your views here.
class APIOverview(generics.RetrieveAPIView):
  def get(self, request):
    api_urls = {
      'Registration': '/register/',
      'Login': '/login/',
      'Logout': '/logout/',
      'Token_refresh': '/token/refresh/',
      'All_notes': '/notes/',
      'Note_detail': '/notes/pk/',
      'Add': '/notes/create/',
      'Update': '/notes/update/pk/',
      'Delete': '/notes/delete/pk/',
      'Upload image': '/upload-image/',
    }
    return Response(api_urls, status=200)

class RegisterView(generics.CreateAPIView):
  permission_classes = [AllowAny]
  serializer_class = RegisterSerializer
  def post(self, request):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    return Response({
      "user": UserSerializer(user).data,
      "refresh": str(refresh),
      "access": str(refresh.access_token),
    }, status=201)
  
class MyObtainTokenPairView(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer

  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)

    try:
      serializer.is_valid(raise_exception=True)
    except Exception as e:
      return Response({"detail": "Invalid credentials"}, status=401)
    
    user = serializer.user
    username = user.username
    access_token = serializer.validated_data.get("access")
    refresh_token = serializer.validated_data.get("refresh")

    response = Response({"message": "Login successful", 
                         "username": username, 
                         "access_token": access_token, 
                         "refresh_token": refresh_token}, status=200)

    response.set_cookie(
      key='access_token',
      value=access_token,
      httponly=True,
      secure=True,
      samesite='None',
    )

    response.set_cookie(
      key='refresh_token',
      value=refresh_token,
      httponly=True,
      secure=True,
      samesite='None',
    )

    return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
          return Response({"error": "No refresh token in cookies"}, status=400)

        request.data["refresh"] = refresh_token

        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get("access")
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
            )
        return response

class LogoutView(APIView):
  def post(self, request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
      return Response({"detail": "Refresh token is missing"}, status=400)
    
    try:
      token = RefreshToken(refresh_token)
      token.blacklist()
    except Exception as e:
      pass

    response = Response({"message": "Logout successful"}, status=200)
    response.delete_cookie("access_token", samesite="None")
    response.delete_cookie("refresh_token", samesite="None")
    return response

class SearchView(generics.ListAPIView):
  serializer_class = NotesSerializer
  pagination_class = MyLimitOffsetPagination
  
  def get_queryset(self):
    user = self.request.user
    queryset = Note.objects.filter(user=user).order_by('-created_date')
    search = self.request.query_params.get('search')
    date = self.request.query_params.get('date')
    if search is not None:
      queryset = queryset.filter(
        Q(title__icontains=search) | Q(content__icontains=search)
      )
    if date is not None:
      if date == "today":
        start = timezone.now().date()
        queryset = queryset.filter(created_date__date=start)
      elif date == "yesterday":
        start = timezone.now().date() - timedelta(days=1)
        queryset = queryset.filter(created_date__date=start)
      elif date == "last_week":
        start = timezone.now() - timedelta(days=7)
        queryset = queryset.filter(created_date__gte=start)
      elif date == "last_month":
        start = timezone.now() - timedelta(days=30)
        queryset = queryset.filter(created_date__gte=start)
    return queryset

class DetailView(generics.RetrieveAPIView):
  serializer_class = NotesSerializer
  def get_queryset(self):
    return Note.objects.filter(user=self.request.user)

class CreateView(generics.CreateAPIView):
  serializer_class = NotesSerializer

  def perform_create(self, serializer):
    serializer.save(user=self.request.user)
  
class UpdateView(generics.RetrieveUpdateAPIView):
  serializer_class = NotesSerializer
  def get_queryset(self):
    return Note.objects.filter(user=self.request.user)

def extract_image_urls_from_html(html):
  return re.findall(r'<img[^>]+src="([^"]+)"', html)

def extract_s3_key(image_url):
  match = re.search(r"media/.*", image_url)
  return match.group(0) if match else None

def delete_image_from_s3(s3_key):
  s3 = boto3.client('s3', aws_access_key_id=settings.AWS_ACCESS_KEY_ID, aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
  
  try:
    s3.delete_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=s3_key)
    print(f"Deleted image: {s3_key}")
  except Exception as e:
    print(f"Error deleting from S3: {e}")

def is_image_used_elsewhere(current_note, image_url):
    return Note.objects.exclude(id=current_note.id).filter(content__icontains=image_url).exists()

class DeleteView(generics.RetrieveDestroyAPIView):
  serializer_class = NotesSerializer
  def get_queryset(self):
    return Note.objects.filter(user=self.request.user)
  def perform_destroy(self, instance):
    image_urls = extract_image_urls_from_html(instance.content)
    for url in image_urls:
      if not is_image_used_elsewhere(instance, url):
        s3_key = extract_s3_key(url)
        if s3_key:
          delete_image_from_s3(s3_key)
    return super().perform_destroy(instance)
  
class S3Storage(S3Boto3Storage):
  location = "media/"

class ImageUploadView(APIView):
  parser_classes = (MultiPartParser, FormParser)

  def post(self, request, *args, **kwargs):
    if 'image' not in request.FILES:
      return Response({"error": "No image file found"}, status=400)
    file = request.FILES['image']
    storage = S3Storage()
    file_name = storage.save(f"{file.name}", file)
    file_url = storage.url(file_name)
    return Response({"image_url": file_url}, status=201)
