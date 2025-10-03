# Health Tracker API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require authentication through session-based authentication. Make sure to include cookies in your requests.

## User API Endpoints

### Register User
```http
POST /users/register
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "age": "number",
  "profile_img": "string" (optional)
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "age": "number",
    "profile_img": "string"
  }
}
```

### Login
```http
POST /users/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Logged in successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "age": "number",
    "profile_img": "string"
  }
}
```

### Logout
```http
POST /users/logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User
```http
GET /users
```

**Response:**
```json
{
  "message": "Found a user",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "age": "number",
    "profile_img": "string"
  }
}
```

### Update User
```http
PATCH /users
```

**Request Body:**
```json
{
  "name": "string" (optional),
  "age": "number" (optional),
  "profile_img": "string" (optional)
}
```

**Response:**
```json
{
  "message": "Updated successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "age": "number",
    "profile_img": "string"
  }
}
```

### Delete User
```http
DELETE /users
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "age": "number",
    "profile_img": "string"
  }
}
```

### Upload Profile Image
```http
POST /users/image-upload
```

**Request Body:**
- Form Data with key "image" and file value

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "id": "number",
    "name": "string",
    "email": "string",
    "profile_img": "string"
  }
}
```

## Habit API Endpoints

### Create Habit
```http
POST /habits
```

**Request Body:**
```json
{
  "title": "string",
  "startTime": "datetime",
  "endTime": "datetime",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL" (optional, default: "MEDIUM"),
  "category": "WORK | PERSONAL | HEALTH | FITNESS | HOBBY | STUDY | MINDSET | OTHER" (optional, default: "OTHER")
}
```

**Response:**
```json
{
  "message": "Habit created",
  "data": {
    "id": "number",
    "title": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "priority": "string",
    "category": "string",
    "status": "INCOMPLETE",
    "date": "datetime",
    "userId": "number"
  }
}
```

### Get All Habits
```http
GET /habits
```

**Response:**
```json
{
  "message": "Habits retrieved",
  "data": [
    {
      "id": "number",
      "title": "string",
      "startTime": "datetime",
      "endTime": "datetime",
      "priority": "string",
      "category": "string",
      "status": "string",
      "date": "datetime",
      "userId": "number"
    }
  ]
}
```

### Get Single Habit
```http
GET /habits/:id
```

**Response:**
```json
{
  "message": "Habit retrieved",
  "data": {
    "id": "number",
    "title": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "priority": "string",
    "category": "string",
    "status": "string",
    "date": "datetime",
    "userId": "number"
  }
}
```

### Update Habit
```http
PATCH /habits/:id
```

**Request Body:**
```json
{
  "title": "string" (optional),
  "startTime": "datetime" (optional),
  "endTime": "datetime" (optional),
  "priority": "LOW | MEDIUM | HIGH | CRITICAL" (optional),
  "category": "WORK | PERSONAL | HEALTH | FITNESS | HOBBY | STUDY | MINDSET | OTHER" (optional)
}
```

**Response:**
```json
{
  "message": "Habit updated",
  "data": {
    "id": "number",
    "title": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "priority": "string",
    "category": "string",
    "status": "string",
    "date": "datetime",
    "userId": "number"
  }
}
```

### Update Habit Status
```http
PATCH /habits/:id/status
```

**Request Body:**
```json
{
  "status": "INCOMPLETE | COMPLETED | MISSED"
}
```

**Response:**
```json
{
  "message": "Habit status updated",
  "data": {
    "id": "number",
    "title": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "priority": "string",
    "category": "string",
    "status": "string",
    "date": "datetime",
    "userId": "number"
  }
}
```

### Delete Habit
```http
DELETE /habits/:id
```

**Response:**
```json
{
  "message": "Habit deleted",
  "data": {
    "id": "number",
    "title": "string",
    "startTime": "datetime",
    "endTime": "datetime",
    "priority": "string",
    "category": "string",
    "status": "string",
    "date": "datetime",
    "userId": "number"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Error description",
  "error": "Error details"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authenticated"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details"
}
```

## Notes

1. All authenticated routes require a valid session cookie
2. Dates should be sent in ISO 8601 format
3. All successful responses will have HTTP status codes in the 2xx range
4. File uploads should be sent as multipart/form-data