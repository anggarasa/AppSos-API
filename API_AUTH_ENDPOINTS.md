# API Authentication Endpoints

## Base URL
```
http://localhost:3000/api/v1/auth
```

## Endpoints

### 1. Register User
**POST** `/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 201):**
```json
{
  "status": 201,
  "message": "User registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

**Response (Error - 409):**
```json
{
  "status": 409,
  "message": "Username or Email already exists"
}
```

### 2. Login User
**POST** `/login`

Login with username/email and password.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": null,
      "avatarUrl": null
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "status": 401,
  "message": "Invalid credentials"
}
```

## Validation Rules

### Register Validation:
- `name`: Required, 2-50 characters
- `username`: Required, 3-20 characters, alphanumeric and underscore only
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

### Login Validation:
- `username`: Required (can be username or email)
- `password`: Required, minimum 6 characters

## Notes
- JWT tokens expire in 24 hours
- Passwords are hashed using bcrypt
- Username and email must be unique
- Login accepts both username and email as the username field
