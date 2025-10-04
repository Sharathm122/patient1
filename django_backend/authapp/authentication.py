import os
import jwt
from rest_framework import authentication, exceptions
from .models import User
from datetime import datetime, timedelta


class MongoJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth = authentication.get_authorization_header(request).split()
        if not auth or auth[0].lower() != b'bearer':
            return None

        if len(auth) == 1:
            msg = 'Invalid token header. No credentials provided.'
            raise exceptions.AuthenticationFailed(msg)
        elif len(auth) > 2:
            msg = 'Invalid token header. Token string should not contain spaces.'
            raise exceptions.AuthenticationFailed(msg)

        try:
            token = auth[1].decode()
            payload = jwt.decode(token, os.environ.get('JWT_SECRET', os.environ.get('DJANGO_SECRET_KEY', 'change-me')), algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except Exception:
            raise exceptions.AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id') or payload.get('id')
        if not user_id:
            raise exceptions.AuthenticationFailed('Invalid token payload')

        user = User.objects(id=user_id).first()
        if not user:
            raise exceptions.AuthenticationFailed('User not found')

        # Wrap the mongoengine User to provide DRF expected properties
        class AuthUserWrapper:
            def __init__(self, user):
                self._user = user

            def __getattr__(self, item):
                return getattr(self._user, item)

            @property
            def is_authenticated(self):
                return True

        return (AuthUserWrapper(user), None)


def generate_token_for_user(user, days=7):
    secret = os.environ.get('JWT_SECRET', os.environ.get('DJANGO_SECRET_KEY', 'change-me'))
    exp = datetime.utcnow() + timedelta(days=days)
    payload = {
        'user_id': str(user.id),
        'exp': exp
    }
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token
