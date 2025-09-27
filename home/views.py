from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve

def home(request):
    return serve(request, path='/index.html', document_root=settings.STATIC_ROOT)
