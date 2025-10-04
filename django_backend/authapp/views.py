from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from .authentication import generate_token_for_user, MongoJWTAuthentication


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token = generate_token_for_user(user)
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'token': token,
            'user': user.to_safe_object()
        }, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    role = request.data.get('role')

    if not email or not password or not role:
        return Response({'success': False, 'message': 'Please provide email, password, and role'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.find_by_email_and_role(email, role)
    if not user:
        return Response({'success': False, 'message': 'Invalid credentials or role'}, status=status.HTTP_401_UNAUTHORIZED)

    if not user.check_password(password):
        return Response({'success': False, 'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    from datetime import datetime
    user.last_login = datetime.utcnow()
    user.save()

    token = generate_token_for_user(user)

    return Response({'success': True, 'message': 'Login successful', 'token': token, 'user': user.to_safe_object()}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    user = request.user
    return Response({'success': True, 'user': user.to_safe_object()}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    name = request.data.get('name')
    profile = request.data.get('profile')
    if name:
        user.name = name
    if profile:
        # merge dicts
        user.profile = {**user.profile, **profile}
    user.save()
    return Response({'success': True, 'message': 'Profile updated successfully', 'user': user.to_safe_object()}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    current_password = request.data.get('currentPassword')
    new_password = request.data.get('newPassword')
    if not current_password or not new_password:
        return Response({'success': False, 'message': 'Please provide current and new password'}, status=status.HTTP_400_BAD_REQUEST)
    if not user.check_password(current_password):
        return Response({'success': False, 'message': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'success': True, 'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
