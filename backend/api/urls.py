from django.urls import path
from . import views
urlpatterns = [
    path('', views.Prediction.as_view()),

]
