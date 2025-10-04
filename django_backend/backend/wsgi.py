import os
from django.core.wsgi import get_wsgi_application
from .mongo import connect_mongo

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Connect to MongoDB when starting
connect_mongo()

application = get_wsgi_application()
