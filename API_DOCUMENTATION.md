# User Management API Documentation

## Overview
API untuk mengelola user dengan fitur register, find user, update user, dan delete user.

## Base URL
```
http://localhost:3000/api/v1
```

## Endpoints

### 1. Get All Users
**GET** `/users`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "User bio",
    "avatarUrl": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get User by Username
**GET** `/users/:username`

**Parameters:**
- `username` (string): Username dari user yang dicari

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "bio": "User bio",
  "avatarUrl": "https://example.com/avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "message": "User not found"
}
```

### 3. Create User (Register)
**POST** `/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `name`: Required, 2-50 characters
- `username`: Required, 3-20 characters, alphanumeric and underscore only
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- `400`: Validation error
- `409`: Username or email already exists

### 4. Update User
**PUT** `/users/:id`

**Parameters:**
- `id` (string): UUID dari user yang akan diupdate

**Request Body:**
```json
{
  "name": "John Updated",
  "username": "johnupdated",
  "email": "john.updated@example.com",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/new-avatar.jpg"
}
```

**Validation Rules:**
- At least one field must be provided
- `username`: 3-20 characters, alphanumeric and underscore only
- `email`: Valid email format
- `name`: 2-50 characters
- `bio`: Maximum 500 characters
- `avatarUrl`: Valid URL format

**Response (200):**
```json
{
  "id": "uuid",
  "name": "John Updated",
  "username": "johnupdated",
  "email": "john.updated@example.com",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/new-avatar.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400`: Validation error
- `404`: User not found
- `409`: Username or email already exists

### 5. Delete User
**DELETE** `/users/:id`

**Parameters:**
- `id` (string): UUID dari user yang akan dihapus

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404`: User not found

## Error Handling

Semua endpoint menggunakan error handling yang konsisten:

```json
{
  "message": "Error description"
}
```

**Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

## Security Features

1. **Password Hashing**: Password di-hash menggunakan bcryptjs
2. **JWT Token**: Token JWT diberikan saat user register
3. **Input Validation**: Validasi input menggunakan middleware
4. **Password Exclusion**: Password tidak di-expose di response
5. **CORS**: Konfigurasi CORS untuk keamanan
6. **Helmet**: Security headers menggunakan helmet

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup database:
```bash
npm run db:generate
npm run db:push
```

3. Create `.env` file dengan konfigurasi yang diperlukan:
```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
DIRECT_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

4. Run development server:
```bash
npm run dev
```

## Database Schema

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  name      String
  bio       String?  @db.Text
  avatarUrl String?  @db.Text
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
