from django.urls import path
from . import views

urlpatterns = [
    path('', views.APIOverview.as_view(), name="api-home"),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.MyObtainTokenPairView.as_view(), name="login"),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', views.CustomTokenRefreshView.as_view(), name='token-refresh'),
    path('notes/', views.SearchView.as_view(), name="notes-list"),
    path('notes/<int:pk>/', views.DetailView.as_view(), name="note-detail"),
    path('notes/create/', views.CreateView.as_view(), name="note-create"),
    path('notes/update/<int:pk>/', views.UpdateView.as_view(), name="note-update"),
    path('notes/delete/<int:pk>/', views.DeleteView.as_view(), name="note-delete"),
    path('upload-image/', views.ImageUploadView.as_view(), name="upload-image"),
]
