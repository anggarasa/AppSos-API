# Complete API Documentation

## Overview
This document provides comprehensive documentation for all APIs in the social media application. All APIs have been enhanced with additional endpoints, proper validation, and improved functionality.

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication API (`/auth`)

### POST `/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### POST `/auth/login`
Login user.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

### POST `/auth/refresh`
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

### POST `/auth/logout`
Logout user.

---

## 2. User API (`/users`)

### GET `/users`
Get all users.

### GET `/users/search?q=query&limit=10`
Search users by username or name.

### GET `/users/username/:username`
Get user by username.

### GET `/users/profile/:id`
Get user profile with statistics (posts count, followers, following, etc.).

### GET `/users/activity/:userId?limit=20`
Get user activity feed (recent posts, comments, likes).

### GET `/users/:id`
Get user by ID.

### PUT `/users/:id` 🔒
Update user profile (supports avatar upload).

**Request Body (multipart/form-data):**
```
name: "Updated Name"
username: "newusername"
email: "newemail@example.com"
bio: "Updated bio"
avatar: [file]
```

### DELETE `/users/:id` 🔒
Delete user.

---

## 3. Post API (`/posts`)

### GET `/posts`
Get all posts with author information and counts.

### GET `/posts/:id`
Get post by ID with comments and counts.

### GET `/posts/user/:userId`
Get posts by specific user.

### GET `/posts/saved/:userId` 🔒
Get saved posts by user.

### POST `/posts` 🔒
Create new post (supports image upload).

**Request Body (multipart/form-data):**
```
userId: "user-id"
content: "Post content"
image: [file] (optional)
```

### PUT `/posts/:id` 🔒
Update post (supports image upload).

**Request Body (multipart/form-data):**
```
userId: "user-id"
content: "Updated content"
image: [file] (optional)
```

### DELETE `/posts/:id` 🔒
Delete post.

---

## 4. Comment API (`/comment`)

### GET `/comment/post/:postId`
Get comments for a specific post.

### GET `/comment/user/:userId`
Get comments by specific user.

### GET `/comment/:id`
Get comment by ID.

### POST `/comment` 🔒
Create new comment.

**Request Body:**
```json
{
  "userId": "user-id",
  "postId": "post-id",
  "content": "Comment content"
}
```

### PUT `/comment/:id` 🔒
Update comment.

**Request Body:**
```json
{
  "userId": "user-id",
  "content": "Updated comment content"
}
```

### DELETE `/comment/:id` 🔒
Delete comment.

---

## 5. Like API (`/like`)

### GET `/like/user/:userId/posts`
Get liked posts by user.

### GET `/like/user/:userId`
Get likes by user.

### GET `/like/:id`
Get like by ID.

### GET `/like/count/:postId`
Get like count for a post.

### GET `/like/check/:userId/:postId`
Check if user has liked a post.

### POST `/like` 🔒
Create like.

**Request Body:**
```json
{
  "userId": "user-id",
  "postId": "post-id"
}
```

### DELETE `/like/unlike` 🔒
Unlike post by user and post ID.

**Request Body:**
```json
{
  "userId": "user-id",
  "postId": "post-id"
}
```

### DELETE `/like/:id` 🔒
Delete like by ID.

---

## 6. Save API (`/save`)

### GET `/save/user/:userId` 🔒
Get saved posts by user.

### GET `/save/check/:userId/:postId`
Check if user has saved a post.

### GET `/save/count/:postId`
Get save count for a post.

### GET `/save/:id`
Get save by ID.

### POST `/save` 🔒
Save post.

**Request Body:**
```json
{
  "userId": "user-id",
  "postId": "post-id"
}
```

### DELETE `/save/unsave` 🔒
Unsave post.

**Request Body:**
```json
{
  "userId": "user-id",
  "postId": "post-id"
}
```

---

## 7. Follow API (`/follow`)

### GET `/follow/followers/:userId`
Get followers list for a user.

### GET `/follow/following/:userId`
Get following list for a user.

### GET `/follow/stats/:userId`
Get follow statistics (followers count, following count).

### GET `/follow/check/:followerId/:followingId`
Check if user is following another user.

### GET `/follow/mutual/:userId1/:userId2`
Get mutual follows between two users.

### GET `/follow/suggestions/:userId?limit=10`
Get follow suggestions for a user.

### GET `/follow/:id`
Get follow relationship by ID.

### POST `/follow` 🔒
Follow user.

**Request Body:**
```json
{
  "followerId": "follower-user-id",
  "followingId": "user-to-follow-id"
}
```

### DELETE `/follow/unfollow` 🔒
Unfollow user.

**Request Body:**
```json
{
  "followerId": "follower-user-id",
  "followingId": "user-to-unfollow-id"
}
```

---

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "status": 200,
  "message": "Success message",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "status": 400,
  "message": "Error message",
  "data": {}
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Authentication Required

Endpoints marked with 🔒 require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Upload

Endpoints that support file upload use `multipart/form-data` content type:
- Post images: `/posts` (POST, PUT)
- User avatars: `/users/:id` (PUT)

## Query Parameters

### Pagination
Many list endpoints support pagination:
- `limit`: Number of items per page (default: 10)
- `offset`: Number of items to skip

### Search
Search endpoints support:
- `q`: Search query
- `limit`: Maximum results (default: 10)

## Error Handling

All endpoints include proper error handling with appropriate HTTP status codes and descriptive error messages.

## Validation

All input data is validated using middleware before processing. Common validation rules:
- Required fields are checked
- Email format validation
- Username format validation (3-20 characters, alphanumeric and underscore)
- Password minimum length (6 characters)
- Content length limits
- UUID format validation for IDs

---

## Summary of Enhancements

### Added Endpoints:
1. **Post API**: Update post, get user posts, get saved posts
2. **User API**: Search users, get user by username, get profile with stats, get activity feed
3. **Comment API**: Get post comments, get user comments, update comment, get comment by ID
4. **Like API**: Get liked posts, get user likes, get like by ID
5. **Save API**: Get saved posts, check save status, get save count, get save by ID
6. **Follow API**: Check follow status, get mutual follows, get follow suggestions, get follow by ID

### Features Added:
- Comprehensive search functionality
- User activity feeds
- Statistics and counts for all entities
- Proper validation for all endpoints
- Consistent error handling
- File upload support for posts and avatars
- Follow suggestions algorithm
- Mutual follows detection

All APIs are now production-ready with proper validation, error handling, and comprehensive functionality for a complete social media application.
