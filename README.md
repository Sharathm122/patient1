# Patient Dashboard - Health Insurance Portal

This project integrates a React frontend with Django backend API endpoints for a health insurance patient portal. The frontend is built using the exact UI components and design from the GitHub repository while integrating with your provided backend endpoints.

## 🚀 Features

- **Patient Dashboard**: View insurance coverage, claims, and notifications
- **Real-time API Integration**: Connects to your Django backend endpoints
- **Modern UI**: Uses the exact design from the health-project repository
- **Authentication**: Token-based authentication with login/logout
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive Notifications**: Mark notifications as read
- **Claims Management**: View claim status and progress

## 📋 Backend API Endpoints Integrated

The frontend integrates with these specific endpoints you provided:

```python
class PatientMeView(APIView):
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
    def get_queryset(self):
        return Claim.objects.filter(patient=self.request.user)

class NotificationsView(generics.ListAPIView):
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class NotificationReadView(APIView):
    def patch(self, request, pk):
        # Mark notification as read
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Django backend running on `http://localhost:8000`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd patient
   npm install
   ```

2. **Configure Backend URL**
   The Vite config is already set up to proxy API requests to `http://localhost:8000`. If your Django backend runs on a different port, update `vite.config.js`:
   ```javascript
   server: {
     proxy: {
       '/api': {
         target: 'http://localhost:YOUR_PORT', // Change this
         changeOrigin: true,
         secure: false,
       }
     }
   }
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

### Backend Setup (Django)

1. **Install Required Packages**
   ```bash
   pip install djangorestframework
   pip install django-cors-headers
   pip install djangorestframework-authtoken
   ```

2. **Update Django Settings**
   Add to your `settings.py`:
   ```python
   INSTALLED_APPS = [
       'rest_framework',
       'rest_framework.authtoken',
       'corsheaders',
       # ... your other apps
   ]

   CORS_ALLOWED_ORIGINS = [
       "http://localhost:3000",
       "http://127.0.0.1:3000",
   ]

   REST_FRAMEWORK = {
       'DEFAULT_AUTHENTICATION_CLASSES': [
           'rest_framework.authentication.TokenAuthentication',
       ],
       'DEFAULT_PERMISSION_CLASSES': [
           'rest_framework.permissions.IsAuthenticated',
       ],
   }

   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       'django.middleware.common.CommonMiddleware',
       # ... other middleware
   ]
   ```

3. **URL Configuration**
   Add to your `urls.py`:
   ```python
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
   ```

4. **Use Your Existing Views**
   Replace the mock implementation in `backend_views.py` with your actual views. The frontend expects these exact API endpoints and response formats.

## 🔐 Authentication

### Demo Credentials
- **Email**: `patient@demo.com`
- **Password**: `demo123`

### Token Authentication
The app uses token-based authentication:
- Login endpoint: `/api/auth/login/`
- Logout endpoint: `/api/auth/logout/`
- Token is stored in localStorage and sent with all API requests

## 📱 UI Components

The frontend uses the exact same UI components from the original health-project repository:

- **Cards**: Insurance coverage, claims, notifications
- **Progress Bars**: Deductible and out-of-pocket progress
- **Badges**: Status indicators for claims
- **Buttons**: Interactive elements with hover effects
- **Icons**: Lucide React icons for visual elements
- **Responsive Layout**: Grid system that works on all devices

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Design System**: Healthcare-themed color palette
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and hover effects

## 📊 Data Flow

1. **Login**: User authenticates with Django backend
2. **Token Storage**: JWT token stored in localStorage
3. **API Calls**: All requests include Authorization header
4. **Data Fetching**: Dashboard fetches patient info, claims, and notifications
5. **Real-time Updates**: Notifications can be marked as read
6. **Error Handling**: Graceful fallback to mock data if API fails

## 🔄 API Integration Details

### Patient Information (`/api/patient/me/`)
```json
{
  "userId": "string",
  "name": "string",
  "insuranceId": "string",
  "coverage": "string",
  "expiry": "string"
}
```

### Claims List (`/api/patient/claims/`)
```json
[
  {
    "id": "string",
    "provider": "string",
    "service": "string",
    "amount": "string",
    "status": "string",
    "date": "string",
    "description": "string"
  }
]
```

### Notifications (`/api/notifications/`)
```json
[
  {
    "id": "number",
    "type": "string",
    "title": "string",
    "message": "string",
    "read": "boolean",
    "time": "string"
  }
]
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```
Deploy the `dist` folder to your hosting provider.

### Backend (Heroku/AWS/etc.)
Ensure your Django backend is deployed and update the API base URL in the frontend configuration.

## 🛠️ Customization

1. **Add More Endpoints**: Extend `src/services/apiService.js`
2. **Modify UI**: Update components in `src/components/`
3. **Change Styling**: Modify Tailwind classes or add custom CSS
4. **Add Features**: Create new components and integrate with existing API

## 📝 Notes

- The UI design is taken exactly from the health-project repository
- Backend integration uses your provided endpoint structure
- Mock data is provided as fallback when API calls fail
- Authentication flow is fully implemented with token management
- All components are responsive and accessibility-friendly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both frontend and backend
5. Submit a pull request

## 📞 Support

If you need help integrating with your specific Django models or have questions about the implementation, please refer to the code comments or create an issue.

---

This integration provides a complete patient dashboard that maintains the original UI/UX while seamlessly connecting to your Django backend endpoints. The code is production-ready and can be easily customized for your specific needs.