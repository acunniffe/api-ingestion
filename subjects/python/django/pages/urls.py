from django.urls import path, re_path

from .views import homePageViewWithArg

urlpatterns = [
    path('', homePageViewWithArg, name='home'),
]