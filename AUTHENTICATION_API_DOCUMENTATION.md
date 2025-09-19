# Authentication API Documentation

## Overview
Sistem authentication menggunakan JWT dengan accessToken dan refreshToken untuk keamanan yang lebih baik.

## Authentication Flow

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
}
```

### 2. Login User
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "User bio",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

### 3. Refresh Access Token
**Endpoint:** `POST /api/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "User bio",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
}
```

### 4. Logout User
**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "status": 200,
  "message": "Logout successful"
}
```

## Token Information

### Access Token
- **Lifetime:** 15 minutes
- **Purpose:** Untuk mengakses API yang memerlukan authentication
- **Header:** `Authorization: Bearer <accessToken>`

### Refresh Token
- **Lifetime:** 7 days
- **Purpose:** Untuk mendapatkan access token baru
- **Usage:** Kirim dalam body request ke endpoint `/api/auth/refresh`

## Protected Endpoints

Semua endpoint berikut memerlukan access token yang valid:

### Posts
- `POST /api/posts` - Create post
- `DELETE /api/posts/:id` - Delete post

### Users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Likes
- `POST /api/likes` - Create like
- `DELETE /api/likes/unlike` - Unlike post
- `DELETE /api/likes/:id` - Delete like

### Comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment

### Saves
- `POST /api/saves` - Save post
- `DELETE /api/saves/unsave` - Unsave post

### Follows
- `POST /api/follows` - Follow user
- `DELETE /api/follows/unfollow` - Unfollow user

## Public Endpoints

Endpoint berikut dapat diakses tanpa authentication:

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by username

### Likes
- `GET /api/likes/count/:postId` - Get like count for post
- `GET /api/likes/check/:userId/:postId` - Check if user liked post

### Follows
- `GET /api/follows/followers/:userId` - Get followers list
- `GET /api/follows/following/:userId` - Get following list
- `GET /api/follows/stats/:userId` - Get follow statistics

## Error Responses

### 401 Unauthorized
```json
{
  "status": 401,
  "message": "Access token required"
}
```

```json
{
  "status": 401,
  "message": "Invalid or expired token"
}
```

```json
{
  "status": 401,
  "message": "User not found"
}
```

### 400 Bad Request
```json
{
  "status": 400,
  "message": "Refresh token is required"
}
```

## Environment Variables

Pastikan untuk mengatur environment variables berikut:

```env
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_jwt_secret_here
```

## Security Notes

1. **Access Token** memiliki lifetime yang pendek (15 menit) untuk keamanan
2. **Refresh Token** memiliki lifetime yang lebih panjang (7 hari) untuk user experience
3. Semua token menggunakan secret yang berbeda untuk keamanan tambahan
4. User info selalu diverifikasi dari database untuk memastikan user masih aktif
5. Token yang expired atau invalid akan mengembalikan error 401
