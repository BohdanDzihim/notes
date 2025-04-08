from django.db import models
from users.models import User

# Create your models here.
class Note(models.Model):
  user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
  title = models.CharField(max_length=255)
  content = models.TextField()
  created_date = models.DateTimeField(auto_now_add=True)
  updated_date = models.DateTimeField(auto_now=True)

  def __str__(self):
    return self.title
