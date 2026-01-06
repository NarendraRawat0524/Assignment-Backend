# Forum API Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Response Format](#response-format)
5. [Users API](#users-api)
6. [Topics API](#topics-api)
7. [Posts API](#posts-api)
8. [Error Handling](#error-handling)

---

## Introduction

This REST API provides endpoints for managing a forum system, including users, topics, and posts. Built with Node.js, Express, and MongoDB, it follows RESTful principles and returns JSON responses.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, this API does not implement authentication. In production, implement JWT-based authentication for secure access.

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": { },
  "count": 10
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Users API

### 1. Get All Users

Retrieve a list of all registered users.

**Endpoint:** `GET /api/users`

**Request:**
```http
GET /api/users HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "reputation": 150,
      "postCount": 25,
      "joinDate": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:20:00.000Z"
    }
  ]
}
```

### 2. Get User By ID

Retrieve details of a specific user.

**Endpoint:** `GET /api/users/:id`

**Parameters:**
- `id` (path parameter) - User's MongoDB ObjectId

**Request:**
```http
GET /api/users/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "reputation": 150,
    "postCount": 25,
    "joinDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### 3. Create User

Register a new user in the system.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Validation Rules:**
- `username`: Required, 3-30 characters, unique
- `email`: Required, valid email format, unique

**Request:**
```http
POST /api/users HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "reputation": 0,
    "postCount": 0,
    "joinDate": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

### 4. Update User

Update an existing user's information.

**Endpoint:** `PUT /api/users/:id`

**Parameters:**
- `id` (path parameter) - User's MongoDB ObjectId

**Request Body:**
```json
{
  "username": "johndoe_updated",
  "email": "newemail@example.com",
  "reputation": 200
}
```

**Request:**
```http
PUT /api/users/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "username": "johndoe_updated",
  "reputation": 200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe_updated",
    "email": "john@example.com",
    "reputation": 200,
    "postCount": 25
  }
}
```

### 5. Delete User

Remove a user from the system.

**Endpoint:** `DELETE /api/users/:id`

**Parameters:**
- `id` (path parameter) - User's MongoDB ObjectId

**Request:**
```http
DELETE /api/users/507f1f77bcf86cd799439011 HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Topics API

### 1. Get All Topics

Retrieve all forum topics with optional filtering and sorting.

**Endpoint:** `GET /api/topics`

**Query Parameters:**
- `category` (optional) - Filter by category: general, technical, announcements, questions
- `sort` (optional) - Sort order: popular (by views), recent (by date)

**Request:**
```http
GET /api/topics?category=technical&sort=popular HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "How to use Node.js with MongoDB",
      "slug": "how-to-use-node-js-with-mongodb",
      "content": "I'm looking for best practices...",
      "category": "technical",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "john@example.com"
      },
      "viewCount": 245,
      "postCount": 12,
      "isPinned": false,
      "isLocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-20T14:20:00.000Z"
    }
  ]
}
```

### 2. Get Topic By ID

Retrieve a specific topic with full details. Increments view count.

**Endpoint:** `GET /api/topics/:id`

**Parameters:**
- `id` (path parameter) - Topic's MongoDB ObjectId

**Request:**
```http
GET /api/topics/507f191e810c19729de860ea HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "title": "How to use Node.js with MongoDB",
    "slug": "how-to-use-node-js-with-mongodb",
    "content": "I'm looking for best practices...",
    "category": "technical",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "reputation": 150
    },
    "viewCount": 246,
    "postCount": 12,
    "isPinned": false,
    "isLocked": false
  }
}
```

### 3. Create Topic

Create a new discussion topic.

**Endpoint:** `POST /api/topics`

**Request Body:**
```json
{
  "title": "How to use Node.js with MongoDB",
  "content": "I'm looking for best practices when integrating Node.js with MongoDB...",
  "category": "technical",
  "author": "507f1f77bcf86cd799439011"
}
```

**Validation Rules:**
- `title`: Required, max 200 characters
- `content`: Required
- `category`: Required, must be one of: general, technical, announcements, questions
- `author`: Required, valid user ObjectId

**Request:**
```http
POST /api/topics HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "title": "How to use Node.js with MongoDB",
  "content": "I'm looking for best practices...",
  "category": "technical",
  "author": "507f1f77bcf86cd799439011"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "title": "How to use Node.js with MongoDB",
    "slug": "how-to-use-node-js-with-mongodb",
    "content": "I'm looking for best practices...",
    "category": "technical",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "viewCount": 0,
    "postCount": 0,
    "isPinned": false,
    "isLocked": false
  }
}
```

### 4. Update Topic

Update an existing topic's details.

**Endpoint:** `PUT /api/topics/:id`

**Parameters:**
- `id` (path parameter) - Topic's MongoDB ObjectId

**Request Body:**
```json
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "general",
  "isPinned": true,
  "isLocked": false
}
```

**Request:**
```http
PUT /api/topics/507f191e810c19729de860ea HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "isPinned": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f191e810c19729de860ea",
    "title": "How to use Node.js with MongoDB",
    "content": "Updated content...",
    "isPinned": true,
    "isLocked": false
  }
}
```

### 5. Delete Topic

Delete a topic from the forum.

**Endpoint:** `DELETE /api/topics/:id`

**Parameters:**
- `id` (path parameter) - Topic's MongoDB ObjectId

**Request:**
```http
DELETE /api/topics/507f191e810c19729de860ea HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "message": "Topic deleted successfully"
}
```

---

## Posts API

### 1. Get Posts By Topic

Retrieve all posts within a specific topic.

**Endpoint:** `GET /api/posts/topic/:topicId`

**Parameters:**
- `topicId` (path parameter) - Topic's MongoDB ObjectId

**Request:**
```http
GET /api/posts/topic/507f191e810c19729de860ea HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "content": "Great question! Here's what I found...",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "email": "john@example.com",
        "reputation": 150
      },
      "topic": "507f191e810c19729de860ea",
      "upvotes": 5,
      "downvotes": 1,
      "isEdited": false,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

### 2. Create Post

Add a new post to a topic.

**Endpoint:** `POST /api/posts`

**Request Body:**
```json
{
  "content": "This is my response to the topic...",
  "author": "507f1f77bcf86cd799439011",
  "topic": "507f191e810c19729de860ea"
}
```

**Validation Rules:**
- `content`: Required
- `author`: Required, valid user ObjectId
- `topic`: Required, valid topic ObjectId, topic must not be locked

**Request:**
```http
POST /api/posts HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "content": "This is my response...",
  "author": "507f1f77bcf86cd799439011",
  "topic": "507f191e810c19729de860ea"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "content": "This is my response...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "topic": "507f191e810c19729de860ea",
    "upvotes": 0,
    "downvotes": 0,
    "isEdited": false
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Topic is locked, cannot add new posts"
}
```

### 3. Update Post

Edit an existing post's content.

**Endpoint:** `PUT /api/posts/:id`

**Parameters:**
- `id` (path parameter) - Post's MongoDB ObjectId

**Request Body:**
```json
{
  "content": "Updated post content..."
}
```

**Request:**
```http
PUT /api/posts/507f1f77bcf86cd799439012 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "content": "Updated content..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "content": "Updated content...",
    "isEdited": true,
    "editedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

### 4. Vote on Post

Upvote or downvote a post.

**Endpoint:** `POST /api/posts/:id/vote`

**Parameters:**
- `id` (path parameter) - Post's MongoDB ObjectId

**Request Body:**
```json
{
  "voteType": "upvote"
}
```

**Validation Rules:**
- `voteType`: Required, must be either "upvote" or "downvote"

**Request:**
```http
POST /api/posts/507f1f77bcf86cd799439012/vote HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "voteType": "upvote"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "content": "This is my response...",
    "upvotes": 6,
    "downvotes": 1
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid vote type. Use \"upvote\" or \"downvote\""
}
```

### 5. Delete Post

Remove a post from a topic.

**Endpoint:** `DELETE /api/posts/:id`

**Parameters:**
- `id` (path parameter) - Post's MongoDB ObjectId

**Request:**
```http
DELETE /api/posts/507f1f77bcf86cd799439012 HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## Error Handling

### HTTP Status Codes

The API uses standard HTTP status codes:

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request parameters or body
- `404 Not Found` - Resource not found
- `403 Forbidden` - Action not allowed (e.g., posting to locked topic)
- `500 Internal Server Error` - Server error

### Common Error Responses

**Validation Error:**
```json
{
  "success": false,
  "message": "Username and email are required"
}
```

**Resource Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Duplicate Entry:**
```json
{
  "success": false,
  "message": "Username or email already exists"
}
```

**Server Error:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String (required, unique, 3-30 chars),
  email: String (required, unique, lowercase),
  reputation: Number (default: 0),
  postCount: Number (default: 0),
  joinDate: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```

### Topic Model
```javascript
{
  _id: ObjectId,
  title: String (required, max 200 chars),
  slug: String (required, unique),
  author: ObjectId (ref: User),
  content: String (required),
  category: String (enum: general, technical, announcements, questions),
  viewCount: Number (default: 0),
  postCount: Number (default: 0),
  isPinned: Boolean (default: false),
  isLocked: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  _id: ObjectId,
  content: String (required),
  author: ObjectId (ref: User),
  topic: ObjectId (ref: Topic),
  upvotes: Number (default: 0),
  downvotes: Number (default: 0),
  isEdited: Boolean (default: false),
  editedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing the API

You can test the API using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- REST Client (VS Code extension)

### Example cURL Commands

**Create a User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com"}'
```

**Get All Topics:**
```bash
curl http://localhost:3000/api/topics
```

**Create a Topic:**
```bash
curl -X POST http://localhost:3000/api/topics \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My First Topic",
    "content":"This is the content",
    "category":"general",
    "author":"USER_ID_HERE"
  }'
```

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. MongoDB ObjectIds are 24-character hexadecimal strings
3. The API automatically populates author details in responses
4. Topic slugs are auto-generated from titles
5. Viewing a topic automatically increments its view count
6. Creating a post increments the topic's post count
7. Locked topics cannot receive new posts
