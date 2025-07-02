# API Documentation

Project Myriad Backend API Reference

## Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://your-domain.com` (TBD)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through the login endpoint and expire after 7 days.

## Endpoints

### Health Check

#### GET /health

Check if the server is running and healthy.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-02T17:00:00.000Z",
  "version": "1.0.0"
}
```

### Authentication

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response (Success):**
```json
{
  "user": {
    "id": 1,
    "username": "your_username"
  }
}
```

**Response (Error):**
```json
{
  "error": "Username already exists"
}
```

#### POST /api/auth/login

Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "username": "your_username",
  "password": "your_password"
}
```

**Response (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### Series Management

#### GET /api/series

Get all series for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "series": [
    {
      "id": 1,
      "title": "My Manga Series",
      "cover_path": "/uploads/extracted/cover.jpg",
      "user_id": 1,
      "created_at": "2025-07-02T17:00:00.000Z"
    }
  ]
}
```

#### POST /api/series/upload

Upload a new manga series (CBZ/ZIP file).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `file`: CBZ or ZIP file (multipart form data)

**Response (Success):**
```json
{
  "message": "File uploaded",
  "series": {
    "id": 1,
    "title": "New Manga Series",
    "cover_path": "/uploads/extracted/cover.jpg",
    "user_id": 1
  }
}
```

**Response (Error):**
```json
{
  "error": "Only .cbz or .zip files are supported"
}
```

#### GET /api/series/:id/images

Get all image URLs for a specific series.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "images": [
    "/api/series/1/static/page001.jpg",
    "/api/series/1/static/page002.jpg",
    "/api/series/1/static/page003.jpg"
  ]
}
```

#### PATCH /api/series/:id

Update a series title.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Series Title"
}
```

**Response:**
```json
{
  "series": {
    "id": 1,
    "title": "Updated Series Title",
    "cover_path": "/uploads/extracted/cover.jpg",
    "user_id": 1
  }
}
```

#### DELETE /api/series/:id

Delete a series and its associated files.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Series deleted"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

Error responses have the following format:
```json
{
  "error": "Error description"
}
```

## Rate Limiting

Currently no rate limiting is implemented. This will be added in future versions for production use.

## File Upload Specifications

### Supported Formats

- `.cbz` (Comic Book ZIP)
- `.zip` (Standard ZIP archives)
- `.cbr` (Comic Book RAR) - *Planned*

### File Size Limits

- Maximum file size: 100MB (configurable via environment variable)
- Images within archives: No specific limit

### Image Requirements

- Supported image formats: JPEG, PNG
- Recommended resolution: Up to 2048x2048 pixels
- Color depth: 24-bit RGB or 8-bit grayscale

### File Structure

CBZ/ZIP files should contain images in the root directory or a single subdirectory. Images are sorted naturally (1.jpg, 2.jpg, 10.jpg, etc.).

## Development Notes

### Database Schema

The API uses PostgreSQL with the following main tables:

- `users` - User accounts
- `series` - Manga/comic series
- `reading_progress` - User reading progress tracking

### File Storage

- Uploaded files are stored in `/uploads` directory
- Extracted images are stored in `{filename}_extracted/` subdirectories
- Cover images are the first image found in each archive

### Security Considerations

- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt with salt rounds = 10
- File uploads are validated by extension and MIME type
- User data is isolated by user ID in database queries
