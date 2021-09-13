from django.conf.urls import url

from tictactoegame.consumers import TicTacToeConsumer

websocket_urlpatterns = [
    url(r'^ws/play/(?P<play_room>\w+)/$', TicTacToeConsumer.as_asgi()),
]