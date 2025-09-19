# API Documentation - AppSosV2

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
API menggunakan JWT (JSON Web Token) untuk autentikasi. Untuk endpoint yang memerlukan autentikasi, sertakan header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
Semua response mengikuti format standar:
```json
{
  "status": 200,
  "message": "Success message",
  "data": { ... },
  "pagination": { ... } // untuk endpoint dengan pagination
}
```

## Error Response Format
```json
{
  "status": 400,
  "message": "Error message"
}
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Mendaftarkan user baru.

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
- `name`: 2-50 karakter
- `username`: 3-20 karakter, hanya huruf, angka, dan underscore
- `email`: format email yang valid
- `password`: minimal 6 karakter

**Response:**
```json
{
  "status": 201,
  "message": "User registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 1.2 Login User
**POST** `/auth/login`

Login user dengan username dan password.

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
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

### 1.3 Refresh Token
**POST** `/auth/refresh`

Refresh access token menggunakan refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 1.4 Logout
**POST** `/auth/logout`

Logout user (client-side token removal).

**Response:**
```json
{
  "status": 200,
  "message": "Logout successful"
}
```

---

## 2. User Endpoints

### 2.1 Get All Users
**GET** `/users`

Mendapatkan daftar semua users dengan pagination.

**Query Parameters:**
- `page` (optional): halaman (default: 1)
- `limit` (optional): jumlah data per halaman (default: 10)

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "bio": "User bio",
      "avatarUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2.2 Search Users
**GET** `/users/search?q=search_term`

Mencari users berdasarkan query.

**Query Parameters:**
- `q` (required): search query
- `page` (optional): halaman
- `limit` (optional): jumlah data per halaman

**Response:**
```json
{
  "status": 200,
  "message": "Users found successfully",
  "data": [...],
  "pagination": {...}
}
```

### 2.3 Get User by Username
**GET** `/users/username/:username`

Mendapatkan user berdasarkan username.

**Response:**
```json
{
  "status": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "User bio",
    "avatarUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.4 Get User Profile with Stats
**GET** `/users/profile/:id`

Mendapatkan profil user dengan statistik (posts count, followers count, dll).

**Response:**
```json
{
  "status": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {...},
    "stats": {
      "postsCount": 10,
      "followersCount": 50,
      "followingCount": 30
    }
  }
}
```

### 2.5 Get User Activity Feed
**GET** `/users/activity/:userId`

Mendapatkan activity feed user dengan pagination.

**Query Parameters:**
- `page` (optional): halaman
- `limit` (optional): jumlah data per halaman

**Response:**
```json
{
  "status": 200,
  "message": "User activity retrieved successfully",
  "data": [...],
  "pagination": {...}
}
```

### 2.6 Get User by ID
**GET** `/users/:id`

Mendapatkan user berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "bio": "User bio",
    "avatarUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.7 Update User
**PUT** `/users/:id` 🔒

Update data user. Mendukung upload avatar.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `name` (optional): nama user
- `username` (optional): username
- `email` (optional): email
- `bio` (optional): bio user (max 500 karakter)
- `avatar` (optional): file gambar avatar

**Response:**
```json
{
  "status": 200,
  "message": "User update successful",
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "username": "updated_username",
    "email": "updated@example.com",
    "bio": "Updated bio",
    "avatarUrl": "https://...",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2.8 Delete User
**DELETE** `/users/:id` 🔒

Menghapus user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "User deleted successfully"
}
```

---

## 3. Post Endpoints

### 3.1 Get All Posts
**GET** `/posts`

Mendapatkan daftar semua posts dengan pagination.

**Query Parameters:**
- `page` (optional): halaman
- `limit` (optional): jumlah data per halaman

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "content": "Post content",
      "imageUrl": "https://...",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "username": "johndoe",
        "avatarUrl": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {...}
}
```

### 3.2 Get Post by ID
**GET** `/posts/:id`

Mendapatkan post berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "content": "Post content",
    "imageUrl": "https://...",
    "userId": "uuid",
    "user": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.3 Get Posts by User
**GET** `/posts/user/:userId`

Mendapatkan posts dari user tertentu dengan pagination.

**Query Parameters:**
- `page` (optional): halaman
- `limit` (optional): jumlah data per halaman

**Response:**
```json
{
  "status": 200,
  "message": "User posts retrieved successfully",
  "data": [...],
  "pagination": {...}
}
```

### 3.4 Get Saved Posts by User
**GET** `/posts/saved/:userId` 🔒

Mendapatkan posts yang disimpan user dengan pagination.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): halaman
- `limit` (optional): jumlah data per halaman

**Response:**
```json
{
  "status": 200,
  "message": "Saved posts retrieved successfully",
  "data": [...],
  "pagination": {...}
}
```

### 3.5 Create Post
**POST** `/posts` 🔒

Membuat post baru. Mendukung upload gambar.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `userId` (required): ID user yang membuat post
- `content` (required): konten post (max 2000 karakter)
- `image` (optional): file gambar

**Response:**
```json
{
  "status": 201,
  "message": "Post created successfully",
  "data": {
    "id": "uuid",
    "content": "Post content",
    "imageUrl": "https://...",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.6 Update Post
**PUT** `/posts/:id` 🔒

Update post. Hanya owner yang bisa update.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
- `userId` (required): ID user (untuk verifikasi ownership)
- `content` (optional): konten post baru
- `image` (optional): file gambar baru

**Response:**
```json
{
  "status": 200,
  "message": "Post updated successfully",
  "data": {
    "id": "uuid",
    "content": "Updated content",
    "imageUrl": "https://...",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3.7 Delete Post
**DELETE** `/posts/:id` 🔒

Menghapus post.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Post deleted successfully"
}
```

---

## 4. Comment Endpoints

### 4.1 Get Comments by Post
**GET** `/comment/post/:postId`

Mendapatkan komentar untuk post tertentu.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "content": "Comment content",
      "userId": "uuid",
      "postId": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "username": "johndoe",
        "avatarUrl": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4.2 Get Comments by User
**GET** `/comment/user/:userId`

Mendapatkan komentar dari user tertentu.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [...]
}
```

### 4.3 Get Comment by ID
**GET** `/comment/:id`

Mendapatkan komentar berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "content": "Comment content",
    "userId": "uuid",
    "postId": "uuid",
    "user": {...},
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4.4 Create Comment
**POST** `/comment` 🔒

Membuat komentar baru.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "postId": "uuid",
  "content": "Comment content"
}
```

**Validation Rules:**
- `content`: 1-2000 karakter
- `userId` dan `postId`: format UUID

**Response:**
```json
{
  "status": 201,
  "message": "Comment created successfully",
  "data": {
    "id": "uuid",
    "content": "Comment content",
    "userId": "uuid",
    "postId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4.5 Update Comment
**PUT** `/comment/:id` 🔒

Update komentar.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "content": "Updated comment content"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Comment updated successfully",
  "data": {
    "id": "uuid",
    "content": "Updated comment content",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4.6 Delete Comment
**DELETE** `/comment/:id` 🔒

Menghapus komentar.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Comment deleted successfully"
}
```

---

## 5. Like Endpoints

### 5.1 Create Like
**POST** `/like` 🔒

Memberikan like pada post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "postId": "uuid"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Like created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "postId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5.2 Unlike Post
**DELETE** `/like/unlike` 🔒

Menghapus like dari post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "postId": "uuid"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Post unliked successfully"
}
```

### 5.3 Delete Like by ID
**DELETE** `/like/:id` 🔒

Menghapus like berdasarkan ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Like deleted successfully"
}
```

### 5.4 Get Liked Posts by User
**GET** `/like/user/:userId/posts`

Mendapatkan posts yang di-like oleh user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "postId": "uuid",
      "userId": "uuid",
      "post": {
        "id": "uuid",
        "content": "Post content",
        "imageUrl": "https://...",
        "user": {...}
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 5.5 Get Likes by User
**GET** `/like/user/:userId`

Mendapatkan semua like dari user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [...]
}
```

### 5.6 Get Like by ID
**GET** `/like/:id`

Mendapatkan like berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "postId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5.7 Get Post Like Count
**GET** `/like/count/:postId`

Mendapatkan jumlah like untuk post tertentu.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "postId": "uuid",
    "likeCount": 25
  }
}
```

### 5.8 Check User Like
**GET** `/like/check/:userId/:postId`

Mengecek apakah user sudah like post tertentu.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "hasLiked": true,
    "likeId": "uuid"
  }
}
```

---

## 6. Save Endpoints

### 6.1 Save Post
**POST** `/save` 🔒

Menyimpan post.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "postId": "uuid"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "Post saved successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "postId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6.2 Unsave Post
**DELETE** `/save/unsave` 🔒

Menghapus post dari saved.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "uuid",
  "postId": "uuid"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Post unsaved successfully"
}
```

### 6.3 Get Saved Posts by User
**GET** `/save/user/:userId` 🔒

Mendapatkan posts yang disimpan user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "postId": "uuid",
      "post": {
        "id": "uuid",
        "content": "Post content",
        "imageUrl": "https://...",
        "user": {...}
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 6.4 Check User Save
**GET** `/save/check/:userId/:postId`

Mengecek apakah user sudah menyimpan post.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "hasSaved": true,
    "saveId": "uuid"
  }
}
```

### 6.5 Get Post Save Count
**GET** `/save/count/:postId`

Mendapatkan jumlah save untuk post.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "postId": "uuid",
    "saveCount": 15
  }
}
```

### 6.6 Get Save by ID
**GET** `/save/:id`

Mendapatkan save berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "postId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 7. Follow Endpoints

### 7.1 Follow User
**POST** `/follow` 🔒

Follow user lain.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "followerId": "uuid",
  "followingId": "uuid"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User followed successfully",
  "data": {
    "id": "uuid",
    "followerId": "uuid",
    "followingId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7.2 Unfollow User
**DELETE** `/follow/unfollow` 🔒

Unfollow user.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "followerId": "uuid",
  "followingId": "uuid"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "User unfollowed successfully"
}
```

### 7.3 Get Followers List
**GET** `/follow/followers/:userId`

Mendapatkan daftar followers user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "followerId": "uuid",
      "followingId": "uuid",
      "follower": {
        "id": "uuid",
        "name": "John Doe",
        "username": "johndoe",
        "avatarUrl": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7.4 Get Following List
**GET** `/follow/following/:userId`

Mendapatkan daftar following user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "followerId": "uuid",
      "followingId": "uuid",
      "following": {
        "id": "uuid",
        "name": "Jane Doe",
        "username": "janedoe",
        "avatarUrl": "https://..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 7.5 Get Follow Statistics
**GET** `/follow/stats/:userId`

Mendapatkan statistik follow user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "userId": "uuid",
    "followersCount": 50,
    "followingCount": 30
  }
}
```

### 7.6 Check Follow Status
**GET** `/follow/check/:followerId/:followingId`

Mengecek apakah user sudah follow user lain.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "isFollowing": true,
    "followId": "uuid"
  }
}
```

### 7.7 Get Mutual Follows
**GET** `/follow/mutual/:userId1/:userId2`

Mendapatkan mutual follows antara dua user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "Mutual User",
      "username": "mutualuser",
      "avatarUrl": "https://..."
    }
  ]
}
```

### 7.8 Get Follow Suggestions
**GET** `/follow/suggestions/:userId`

Mendapatkan saran follow untuk user.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "Suggested User",
      "username": "suggesteduser",
      "avatarUrl": "https://...",
      "mutualFollowersCount": 5
    }
  ]
}
```

### 7.9 Get Follow by ID
**GET** `/follow/:id`

Mendapatkan follow berdasarkan ID.

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "id": "uuid",
    "followerId": "uuid",
    "followingId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 8. Notification Endpoints

Semua endpoint notification memerlukan autentikasi.

### 8.1 Get User Notifications
**GET** `/notifications` 🔒

Mendapatkan notifikasi user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "like",
      "message": "John Doe liked your post",
      "isRead": false,
      "relatedId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 8.2 Get Unread Count
**GET** `/notifications/unread-count` 🔒

Mendapatkan jumlah notifikasi yang belum dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Success",
  "data": {
    "unreadCount": 5
  }
}
```

### 8.3 Mark as Read
**PUT** `/notifications/:notificationId/read` 🔒

Menandai notifikasi sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Notification marked as read"
}
```

### 8.4 Mark All as Read
**PUT** `/notifications/mark-all-read` 🔒

Menandai semua notifikasi sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "All notifications marked as read"
}
```

### 8.5 Delete Notification
**DELETE** `/notifications/:notificationId` 🔒

Menghapus notifikasi.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Notification deleted successfully"
}
```

---

## 9. Health Check

### 9.1 Health Check
**GET** `/health`

Mengecek status server.

**Response:**
```json
{
  "status": "Okee",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 9.2 API Status
**GET** `/api/v1`

Mengecek status API v1.

**Response:**
```json
{
  "message": "API v1 is working"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Notes

- 🔒 = Endpoint memerlukan autentikasi
- Semua ID menggunakan format UUID
- File upload mendukung format gambar umum (jpg, jpeg, png, gif)
- Pagination default: page=1, limit=10
- Timezone menggunakan UTC
- CORS diaktifkan untuk origin yang dikonfigurasi
