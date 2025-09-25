from django.shortcuts import render

def emotion(request):
    return render(request, 'emotion/index.html')
