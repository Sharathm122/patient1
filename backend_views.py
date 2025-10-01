# Backend API Views (Django REST Framework)
# Save this as views.py in your Django app

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

# Mock models - replace with your actual models
class User:
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

class Claim:
    def __init__(self, id, patient, provider, service, amount, status, date, description):
        self.id = id
        self.patient = patient
        self.provider = provider
        self.service = service
        self.amount = amount
        self.status = status
        self.date = date
        self.description = description

class Notification:
    def __init__(self, id, user, type, title, message, read, time):
        self.id = id
        self.user = user
        self.type = type
        self.title = title
        self.message = message
        self.read = read
        self.time = time

# Serializers - replace with your actual serializers
class ClaimSerializer:
    @staticmethod
    def serialize(claim):
        return {
            "id": claim.id,
            "provider": claim.provider,
            "service": claim.service,
            "amount": claim.amount,
            "status": claim.status,
            "date": claim.date,
            "description": claim.description,
            "progress": 100 if claim.status == "approved" else 65 if claim.status == "processing" else 0
        }

class NotificationSerializer:
    @staticmethod
    def serialize(notification):
        return {
            "id": notification.id,
            "type": notification.type,
            "title": notification.title,
            "message": notification.message,
            "read": notification.read,
            "time": notification.time
        }

class PatientMeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != "patient":
            return Response({"error": "Forbidden"}, status=403)
        return Response({
            "userId": request.user.id,
            "name": request.user.username,
            "insuranceId": "INS12345",
            "coverage": "Full",
            "expiry": "2026-12-31"
        })

class PatientClaimsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Mock data - replace with actual database query
        mock_claims = [
            Claim("CLM-2024-001", self.request.user, "City General Hospital", 
                  "Emergency Visit", "$1,250", "approved", "2024-01-15", 
                  "Acute chest pain evaluation"),
            Claim("CLM-2024-002", self.request.user, "Downtown Clinic", 
                  "Annual Physical", "$350", "processing", "2024-01-10", 
                  "Routine annual physical examination"),
            Claim("CLM-2024-003", self.request.user, "Specialty Care Center", 
                  "Cardiology Consultation", "$800", "denied", "2024-01-05", 
                  "Cardiac stress test and consultation")
        ]
        return mock_claims
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = [ClaimSerializer.serialize(claim) for claim in queryset]
        return Response(serialized_data)

class NotificationsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Mock data - replace with actual database query
        mock_notifications = [
            Notification(1, self.request.user, "approval", "Claim Approved",
                        "Your emergency visit claim (CLM-2024-001) has been approved for $1,250",
                        False, "2 hours ago"),
            Notification(2, self.request.user, "action_required", "Documents Needed",
                        "Additional documentation required for claim CLM-2024-002",
                        False, "1 day ago"),
            Notification(3, self.request.user, "denial", "Claim Denied",
                        "Claim CLM-2024-003 was denied. You can appeal this decision.",
                        True, "3 days ago")
        ]
        return mock_notifications
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serialized_data = [NotificationSerializer.serialize(notification) for notification in queryset]
        return Response(serialized_data)

class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            # Mock implementation - replace with actual database update
            # notif = Notification.objects.get(pk=pk, user=request.user)
            # notif.read = True
            # notif.save()
            
            # Mock response
            mock_notification = Notification(pk, request.user, "approval", "Claim Approved",
                                           "Mock notification message", True, "2 hours ago")
            
            return Response(NotificationSerializer.serialize(mock_notification))
        except Exception:
            return Response({"error": "Not Found"}, status=404)

# Authentication Views
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Mock authentication - replace with actual authentication
        if username == "patient@demo.com" and password == "demo123":
            # Mock user
            mock_user = User(1, "John Doe", "patient")
            
            # Create or get token
            token, created = Token.objects.get_or_create(user_id=1)
            
            return Response({
                "token": str(token.key),
                "name": mock_user.username,
                "role": mock_user.role,
                "message": "Login successful"
            })
        else:
            return Response({
                "error": "Invalid credentials"
            }, status=400)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Delete the user's token
            request.user.auth_token.delete()
        except:
            pass
        
        return Response({"message": "Logged out successfully"})


# URL Configuration (urls.py)
"""
from django.urls import path
from . import views

urlpatterns = [
    path('api/patient/me/', views.PatientMeView.as_view(), name='patient-me'),
    path('api/patient/claims/', views.PatientClaimsView.as_view(), name='patient-claims'),
    path('api/notifications/', views.NotificationsView.as_view(), name='notifications'),
    path('api/notifications/<int:pk>/read/', views.NotificationReadView.as_view(), name='notification-read'),
    path('api/auth/login/', views.LoginView.as_view(), name='login'),
    path('api/auth/logout/', views.LogoutView.as_view(), name='logout'),
]
"""

# Settings Configuration (settings.py)
"""
# Add to INSTALLED_APPS
INSTALLED_APPS = [
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    # ... your other apps
]

# Add CORS settings for frontend
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Add CORS middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]
"""