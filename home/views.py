from django.shortcuts import render

def home(request):
    template_path = 'index.html'
    context = {}
    return render(request, template_path, context)
