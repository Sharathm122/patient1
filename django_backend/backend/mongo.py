import os
from mongoengine import connect


def connect_mongo():
    uri = os.environ.get('MONGODB_URI') or 'mongodb://localhost:27017/patientdb'
    connect(host=uri)
