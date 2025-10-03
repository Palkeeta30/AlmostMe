from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('games/', include('games.urls')),
    path('diet/', include('diet.urls')),
    path('fitness/', include('fitness.urls')),
    path('emotion/', include('emotion.urls')),
    path('contact/', include('contact.urls')),
    path('auth-api/', include('auth_api.urls')),
re_path(r'^(?!admin|auth-api|games|diet|fitness|emotion|contact).*$', serve, {'path': 'build/index.html', 'document_root': settings.STATIC_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
