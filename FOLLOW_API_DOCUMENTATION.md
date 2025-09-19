# Follow/Unfollow API Documentation

## Overview
API untuk fitur follow dan unfollow user telah berhasil dibuat dengan endpoint-endpoint berikut:

## Endpoints

### 1. Follow User
**POST** `/api/v1/follow/`

**Request Body:**
```json
{
  "followerId": "uuid-of-follower",
  "followingId": "uuid-of-user-to-follow"
}
```

**Response (Success - 201):**
```json
{
  "status": 201,
  "message": "Successfully followed user",
  "data": {
    "id": "follow-relationship-id",
    "followerId": "uuid-of-follower",
    "followingId": "uuid-of-followed-user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "follower": {
      "id": "uuid",
      "username": "follower_username",
      "name": "Follower Name",
      "avatarUrl": "avatar_url"
    },
    "following": {
      "id": "uuid",
      "username": "following_username", 
      "name": "Following Name",
      "avatarUrl": "avatar_url"
    }
  }
}
```

**Error Responses:**
- `400` - Cannot follow yourself
- `404` - User not found
- `409` - Already following this user
- `500` - Internal server error

### 2. Unfollow User
**DELETE** `/api/v1/follow/unfollow`

**Request Body:**
```json
{
  "followerId": "uuid-of-follower",
  "followingId": "uuid-of-user-to-unfollow"
}
```

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Successfully unfollowed user",
  "data": {}
}
```

**Error Responses:**
- `404` - Follow relationship not found
- `500` - Internal server error

### 3. Get Followers List
**GET** `/api/v1/follow/followers/:userId`

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Followers retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "username": "follower_username",
      "name": "Follower Name",
      "avatarUrl": "avatar_url",
      "bio": "User bio"
    }
  ]
}
```

### 4. Get Following List
**GET** `/api/v1/follow/following/:userId`

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Following list retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "username": "following_username",
      "name": "Following Name",
      "avatarUrl": "avatar_url",
      "bio": "User bio"
    }
  ]
}
```

### 5. Get Follow Statistics
**GET** `/api/v1/follow/stats/:userId`

**Response (Success - 200):**
```json
{
  "status": 200,
  "message": "Follow statistics retrieved successfully",
  "data": {
    "followersCount": 150,
    "followingCount": 75
  }
}
```

## Validation Rules

### Follow/Unfollow Validation:
- `followerId` dan `followingId` harus ada
- Kedua field harus berupa string
- Kedua field tidak boleh kosong
- Kedua field harus berupa UUID yang valid
- User tidak bisa follow diri sendiri

## Database Schema

Follow relationship menggunakan model `Follow` yang sudah ada di schema:

```prisma
model Follow {
  id          String   @id @default(uuid())
  follower    User     @relation("FollowerRelation", fields: [followerId], references: [id])
  followerId  String
  following   User     @relation("FollowingRelation", fields: [followingId], references: [id])
  followingId String
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
  @@index([followingId])
}
```

## Files Created/Modified

1. **`src/services/follow.service.ts`** - Business logic untuk follow/unfollow
2. **`src/controllers/follow.controller.ts`** - HTTP request handlers
3. **`src/routes/follow.route.ts`** - Route definitions
4. **`src/middleware/validation.ts`** - Validation middleware (updated)
5. **`src/app.ts`** - Main app file (updated to include follow routes)

## Usage Examples

### Follow a user:
```bash
curl -X POST http://localhost:3000/api/v1/follow \
  -H "Content-Type: application/json" \
  -d '{
    "followerId": "user-uuid-1",
    "followingId": "user-uuid-2"
  }'
```

### Unfollow a user:
```bash
curl -X DELETE http://localhost:3000/api/v1/follow/unfollow \
  -H "Content-Type: application/json" \
  -d '{
    "followerId": "user-uuid-1", 
    "followingId": "user-uuid-2"
  }'
```

### Get followers:
```bash
curl http://localhost:3000/api/v1/follow/followers/user-uuid
```

### Get following:
```bash
curl http://localhost:3000/api/v1/follow/following/user-uuid
```

### Get stats:
```bash
curl http://localhost:3000/api/v1/follow/stats/user-uuid
```

## Features Implemented

✅ Follow user functionality
✅ Unfollow user functionality  
✅ Get followers list
✅ Get following list
✅ Get follow statistics
✅ Input validation
✅ Error handling
✅ Database relationship management
✅ Prevent self-following
✅ Prevent duplicate follows
✅ Proper HTTP status codes
✅ Consistent response format
