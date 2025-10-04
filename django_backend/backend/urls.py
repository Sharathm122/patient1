from django.urls import path, include
from django.http import JsonResponse

def health(request):
    return JsonResponse({
        'success': True,
        'message': 'HealthClaim Portal Backend API is running',
        'environment': 'development'
    })

urlpatterns = [
    path('api/health', health),
    path('api/auth/', include('authapp.urls')),
]
