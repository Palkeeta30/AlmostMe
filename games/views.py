from django.shortcuts import render

def games(request):
    return render(request, 'games/index.html')

def memory_game(request):
    return render(request, 'games/memory_game.html')
