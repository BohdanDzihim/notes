from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from notes.models import Note
from .serializers import NotesSerializer, RegisterSerializer, LoginSerializer, LogoutSerializer
from rest_framework import generics, status
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
      'Registration': '/register',
      'Login': '/login',
      'Logout': '/logout',
      'Token_refresh': '/token/refresh',
      'All_notes': '/notes',
      'Note_detail': '/notes/pk',
      'Add': '/notes/create',
      'Update': '/notes/update/pk',
      'Delete': '/notes/delete/pk'
    }

    return Response(api_urls, status=200)

class RegisterView(generics.GenericAPIView):
  permission_classes = [AllowAny]
  serializer_class = RegisterSerializer
  def post(self, request):
    user = request.data
    serializer = self.serializer_class(data=user)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    user_data = serializer.data
    return Response(user_data, status=201)

class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            "username": user.username,
            "tokens": {
                "refresh": str(refresh),
                "access": access_token
            }
        }, status=200)

class LogoutView(generics.GenericAPIView):
  serializer_class = LogoutSerializer
  def post(self, request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(status=204)

class SearchView(generics.ListAPIView):
  serializer_class = NotesSerializer
  pagination_class = MyLimitOffsetPagination
  
  def get_queryset(self):
    user = self.request.user
    queryset = Note.objects.filter(user=user).all()
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
  def get(self, request, pk):
    try:
      user = request.user
      note = Note.objects.filter(user=user).get(id=pk)
    except Note.DoesNotExist:
      return Response({"error": "Note not found or not allowed"}, status=404)
    
    serializer = NotesSerializer(note)
    return Response(serializer.data, status=200)

class CreateView(generics.CreateAPIView):
  serializer_class = NotesSerializer
  def create(self, request):
    serializer = self.serializer_class(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save(user=self.request.user)
    return Response(serializer.data, status=201)
  
class UpdateView(generics.RetrieveUpdateAPIView):
  queryset = Note.objects.all()
  serializer_class = NotesSerializer
  def update(self, request, pk):
    user = request.user
    serializer = self.serializer_class(Note.objects.filter(user=user).get(id=pk), data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    return Response(serializer.errors, status=400)

def extract_image_urls_from_html(html):
  return re.findall(r'<img[^>]+src="([^"]+)"', html)

def extract_s3_key(image_url):
  match = re.search(r"media/.*", image_url)
  return match.group(0) if match else None

def delete_image_from_s3(s3_key):
  s3 = boto3.client('s3', 
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
  
  try:
    s3.delete_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=s3_key)
    print(f"Deleted image: {s3_key}")
  except Exception as e:
    print(f"Error deleting from S3: {e}")

class DeleteView(generics.RetrieveDestroyAPIView):
  queryset = Note.objects.all()
  serializer_class = NotesSerializer
  def delete(self, request, pk):
    user = request.user
    note = Note.objects.filter(user=user).get(id=pk)
    image_urls = extract_image_urls_from_html(note.content)
    for url in image_urls:
      s3_key = extract_s3_key(url)
      if s3_key:
        delete_image_from_s3(s3_key)
    note.delete()
    return Response({"message": "Note deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

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

