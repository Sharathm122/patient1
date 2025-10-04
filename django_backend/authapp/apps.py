from django.apps import AppConfig


class AuthappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authapp'

    def ready(self):
        # Ensure MongoDB connection is established when the app is ready
        try:
            from backend.mongo import connect_mongo
            connect_mongo()
        except Exception:
            # Do not crash app startup if mongo connection fails here; errors surface on DB ops
            pass
