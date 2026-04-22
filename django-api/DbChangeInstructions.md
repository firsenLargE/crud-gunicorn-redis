# 🚀 DRF CRUD API - Intern's Guide

Welcome! This guide will help you understand how to change the db from sqlite to sql .

## 🛠️ 1. Create a Virtual Environment

1.  **Go to your project folder first:**:
    ```bash
    cd your-django-project
    ```
2.  **Then**:

    ```bash
    python3 -m venv venv
    ```

3.  **Activate it**:
    ```bash
    source venv/bin/activate
    ```

---

## 🔑 2. Install mysqlclient inside venv

```bash
    pip install mysqlclient
```

## 📬 3. After This Continue Django Setup

Update settings.py:

```bash
    DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydb',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',
        'PORT': '3306',
        }
    }
```

Then run

```bash
 python manage.py migrate
```


