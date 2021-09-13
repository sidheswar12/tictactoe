"""tictactoe URL Configuration"""

from django.contrib import admin
from django.urls import path
from tictactoegame.viewer import index, tictactoegame

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', index),
    path('play/<play_room>', tictactoegame),
]
