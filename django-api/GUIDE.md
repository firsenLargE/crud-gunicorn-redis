# 🚀 DRF CRUD API - Intern's Guide

Welcome! This guide will help you understand and test the Task Management API.

## 🛠️ 1. Project Setup

To run the server locally, follow these steps:

1.  **Activate Virtual Environment**:
    ```bash
    .\venv\Scripts\activate
    ```
2.  **Start the Server**:
    ```bash
    python manage.py runserver
    ```
    The API will be available at: `http://127.0.0.1:8000/api/`

---

## 🔑 2. Authentication Flow

The API uses **Token Authentication**. You must first signup/login to get a token, then use that token in all subsequent requests.

### **A. Signup (Create a New User)**

- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/api/signup/`
- **Body (JSON)**:
  ```json
  {
    "username": "intern_user",
    "password": "secure_password123",
    "email": "intern@example.com"
  }
  ```
- **Response**: You will receive a success message. **Now proceed to Login to get your token!**

### **B. Login (Get Token for Existing User)**

- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/api/login/`
- **Body (JSON)**:
  ```json
  {
    "username": "intern_user",
    "password": "secure_password123"
  }
  ```
- **Response**: Returns your `token`.

---

## 📬 3. Testing with Postman

To access the task endpoints, you MUST provide the token in the request headers.

### **Setup Headers in Postman**:

1. Go to the **Headers** tab.
2. Add a new key: `Authorization`
3. Set the value to: `Token <your_actual_token_here>`
   _(Example: `Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b`)_
4. Go to **Body** tab $\rightarrow$ **raw** $\rightarrow$ **JSON**.

### **Task Endpoints**:

| Action          | Method   | URL                | Notes                                        |
| :-------------- | :------- | :----------------- | :------------------------------------------- |
| **List Tasks**  | `GET`    | `/api/tasks/`      | Only shows YOUR tasks.                       |
| **Create Task** | `POST`   | `/api/tasks/`      | Requires `title` and optional `description`. |
| **Get Task**    | `GET`    | `/api/tasks/{id}/` | Get details of a specific task.              |
| **Update Task** | `PUT`    | `/api/tasks/{id}/` | Update task title or completion status.      |
| **Delete Task** | `DELETE` | `/api/tasks/{id}/` | Delete a task.                               |

---

## 🔒 4. Data Isolation (The Important Part!)

Notice that if **User A** creates a task, **User B** cannot see it.

- The `user` field is automatically assigned during task creation.
- The list view filters by the logged-in user.
- This is a core concept in backend security: **Data Ownership**.

---

## 📖 5. Swagger Documentation

You can also see every endpoint and test them interactively in your browser:

1. Go to [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
2. Use the `signup` endpoint first.
3. Use the `login` endpoint with your new credentials to get a token.

- **Redoc**: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)

---

### **Happy Coding! 💻**

If you have questions, ask the backend team!
