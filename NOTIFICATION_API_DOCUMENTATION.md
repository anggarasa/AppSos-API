# API Notifikasi - AppSosV2

## Overview
API notifikasi memungkinkan pengguna untuk menerima dan mengelola notifikasi real-time ketika ada aktivitas seperti like, komentar, dan follow.

## Endpoints

### 1. Mendapatkan Notifikasi User
**GET** `/api/v1/notifications`

Mendapatkan daftar notifikasi untuk user yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah notifikasi per halaman (default: 20)

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "LIKE",
        "message": "John Doe (@johndoe) menyukai postingan Anda",
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "sender": {
          "id": "uuid",
          "username": "johndoe",
          "name": "John Doe",
          "avatarUrl": "https://example.com/avatar.jpg"
        },
        "post": {
          "id": "uuid",
          "content": "Post content...",
          "imageUrl": "https://example.com/image.jpg"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

### 2. Mendapatkan Jumlah Notifikasi Belum Dibaca
**GET** `/api/v1/notifications/unread-count`

Mendapatkan jumlah notifikasi yang belum dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Unread count retrieved successfully",
  "data": {
    "unreadCount": 5
  }
}
```

### 3. Menandai Notifikasi sebagai Sudah Dibaca
**PUT** `/api/v1/notifications/:notificationId/read`

Menandai notifikasi tertentu sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `notificationId`: ID notifikasi yang akan ditandai sebagai sudah dibaca

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 4. Menandai Semua Notifikasi sebagai Sudah Dibaca
**PUT** `/api/v1/notifications/mark-all-read`

Menandai semua notifikasi user sebagai sudah dibaca.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updatedCount": 10
  }
}
```

### 5. Menghapus Notifikasi
**DELETE** `/api/v1/notifications/:notificationId`

Menghapus notifikasi tertentu.

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `notificationId`: ID notifikasi yang akan dihapus

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

## Tipe Notifikasi

### 1. LIKE
Dikirim ketika seseorang menyukai postingan user.

**Struktur:**
- `type`: "LIKE"
- `message`: "{sender_name} (@{sender_username}) menyukai postingan Anda"
- `postId`: ID postingan yang disukai
- `senderId`: ID user yang melakukan like

### 2. COMMENT
Dikirim ketika seseorang berkomentar di postingan user.

**Struktur:**
- `type`: "COMMENT"
- `message`: "{sender_name} (@{sender_username}) berkomentar di postingan Anda"
- `postId`: ID postingan yang dikomentari
- `commentId`: ID komentar yang dibuat
- `senderId`: ID user yang berkomentar

### 3. FOLLOW
Dikirim ketika seseorang mulai mengikuti user.

**Struktur:**
- `type`: "FOLLOW"
- `message`: "{sender_name} (@{sender_username}) mulai mengikuti Anda"
- `senderId`: ID user yang melakukan follow

## Integrasi Otomatis

Notifikasi akan otomatis dibuat ketika:

1. **Like Postingan**: Ketika user melakukan like pada postingan, notifikasi akan dikirim ke author postingan (kecuali jika user like postingan sendiri).

2. **Komentar Postingan**: Ketika user berkomentar pada postingan, notifikasi akan dikirim ke author postingan (kecuali jika user komentar di postingan sendiri).

3. **Follow User**: Ketika user mengikuti user lain, notifikasi akan dikirim ke user yang diikuti.

## Error Handling

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Notification not found or not authorized"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Contoh Penggunaan

### Mendapatkan Notifikasi dengan Pagination
```bash
curl -X GET "http://localhost:3000/api/v1/notifications?page=1&limit=10" \
  -H "Authorization: Bearer your_token_here"
```

### Menandai Notifikasi sebagai Sudah Dibaca
```bash
curl -X PUT "http://localhost:3000/api/v1/notifications/notification_id/read" \
  -H "Authorization: Bearer your_token_here"
```

### Mendapatkan Jumlah Notifikasi Belum Dibaca
```bash
curl -X GET "http://localhost:3000/api/v1/notifications/unread-count" \
  -H "Authorization: Bearer your_token_here"
```

## Catatan Penting

1. **Autentikasi**: Semua endpoint memerlukan token JWT yang valid.
2. **Pagination**: Endpoint notifikasi mendukung pagination untuk performa yang lebih baik.
3. **Real-time**: Untuk implementasi real-time, gunakan WebSocket atau Server-Sent Events di sisi client.
4. **Rate Limiting**: Pertimbangkan untuk menambahkan rate limiting untuk mencegah spam notifikasi.
5. **Cleanup**: Implementasikan cleanup job untuk menghapus notifikasi lama secara berkala.

## Database Schema

```sql
-- Tabel Notification
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "receiverId" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "postId" TEXT,
  "commentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- Enum NotificationType
CREATE TYPE "NotificationType" AS ENUM ('LIKE', 'COMMENT', 'FOLLOW');
```
