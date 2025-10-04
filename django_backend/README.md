This directory contains a Django reimplementation of the Express backend found in the repository root.

What is included
- Django project named `backend` and app `authapp`.
- API parity for the following routes (matching Express endpoints and request/response shapes):
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me
  - PUT /api/auth/profile
  - PUT /api/auth/change-password
  - GET /api/health

Quick start (Windows PowerShell)

1. Create a virtualenv and activate it

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Run migrations and create superuser

```powershell
cd django_backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8000
```

Notes
- The original project used MongoDB; this Django port uses SQLite for simplicity and stores the flexible `profile` field as JSON. You can switch to PostgreSQL if you need advanced JSON querying.
- The frontend already calls `/api/*` so you can run the Django server on the same port mapping or configure a proxy in the frontend dev server.
