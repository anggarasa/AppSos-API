# API Response Refactor Documentation

## Overview

Semua response API telah direfactor untuk menggunakan format yang konsisten dengan struktur:

```json
{
  "status": 200,
  "message": "success",
  "data": []
}
```

## Perubahan yang Dilakukan

### 1. Response Utility Functions (`src/lib/response.ts`)

- Dibuat `ResponseHelper` class dengan method-method untuk response yang konsisten
- Dibuat `parsePagination` function untuk menangani pagination
- Support untuk response dengan pagination dan tanpa pagination

### 2. Pagination Implementation

Semua endpoint yang mengembalikan data banyak telah ditambahkan pagination dengan struktur:

```json
{
  "status": 200,
  "message": "success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Endpoints dengan Pagination

- `GET /posts/feed` - Feed posts dengan pagination
- `GET /comments/:postId` - Comments dengan pagination
- `GET /saves/me` - Saved posts dengan pagination
- `GET /users/:userId/posts` - User posts dengan pagination
- `GET /notifications` - Notifications dengan pagination
- `GET /search/users` - User search dengan pagination
- `GET /search/posts` - Post search dengan pagination

### 4. Query Parameters untuk Pagination

- `page` - Halaman yang diminta (default: 1)
- `limit` - Jumlah item per halaman (default: 10, max: 100)

### 5. Response Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

### 6. Error Response Format

```json
{
  "status": 400,
  "message": "validation error",
  "data": {
    "fieldErrors": {...}
  }
}
```

## Contoh Penggunaan

### Success Response

```json
{
  "status": 200,
  "message": "User profile retrieved successfully",
  "data": {
    "id": "user123",
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Pagination Response

```json
{
  "status": 200,
  "message": "Feed retrieved successfully",
  "data": [
    {
      "id": "post1",
      "content": "Hello world",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error Response

```json
{
  "status": 404,
  "message": "Post not found"
}
```

## Migration Notes

- Semua endpoint yang sebelumnya mengembalikan data langsung sekarang dibungkus dalam format response yang konsisten
- Pagination ditambahkan pada endpoint yang mengembalikan array data
- Error handling diperbaiki dengan message yang lebih deskriptif
- Status codes disesuaikan dengan best practices
