from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    name = serializers.CharField()
    role = serializers.ChoiceField(choices=['patient', 'provider', 'payor'])
    profile = serializers.DictField()

    def validate(self, attrs):
        role = attrs.get('role')
        profile = attrs.get('profile') or {}

        if role == 'patient':
            required = ['firstName', 'lastName', 'dateOfBirth', 'memberId']
        elif role == 'provider':
            required = ['firstName', 'lastName', 'specialty', 'licenseNumber', 'npiNumber']
        elif role == 'payor':
            required = ['firstName', 'lastName', 'title', 'employeeId']
        else:
            raise serializers.ValidationError({'role': 'Invalid role'})

        missing = [f for f in required if not profile.get(f)]
        if missing:
            raise serializers.ValidationError({'profile': f'Missing required fields for role {role}: {missing}'})

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(email=validated_data.get('email'), name=validated_data.get('name'), role=validated_data.get('role'), profile=validated_data.get('profile'))
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()


class UserSerializer(serializers.Serializer):
    id = serializers.CharField()
    email = serializers.EmailField()
    name = serializers.CharField()
    role = serializers.CharField()
    profile = serializers.DictField()
    is_active = serializers.BooleanField()
    last_login = serializers.CharField(allow_null=True)
    created_at = serializers.CharField(allow_null=True)
    updated_at = serializers.CharField(allow_null=True)
