from django.shortcuts import render, redirect
from django.http import Http404


def index(request):
    if request.method == "POST":
        play_room = request.POST.get("play_room")
        char_choice = request.POST.get("character")
        return redirect(
            '/play/%s?&choice=%s' 
            %(play_room, char_choice)
        )
    return render(request, "index.html", {})


def tictactoegame(request, play_room):
    choice = request.GET.get("choice")
    if choice not in ['X','O']:
        raise Http404("Choice does not exists")
    context = {
        "char_choice": choice, 
        "play_room": play_room
    }
    return render(request, "tictactoegame.html", context)
