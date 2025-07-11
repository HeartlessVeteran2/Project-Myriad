# 📋 API Reference

## Overview

Project Myriad provides a comprehensive RESTful API with GraphQL support for advanced queries. The API is designed to be developer-friendly with clear documentation, consistent patterns, and robust error handling.

## Base Information

- **Base URL**: `https://api.project-myriad.com/v1` (Production)
- **Base URL**: `http://localhost:3000/api/v1` (Development)
- **Content Type**: `application/json`
- **Authentication**: Bearer JWT tokens
- **Rate Limiting**: 1000 requests per hour per user
- **API Version**: v1 (Current)

## Authentication

### JWT Token Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### POST /auth/login

Authenticate user and receive access tokens.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "username": "otakufan",
      "avatar": "https://example.com/avatar.jpg",
      "created_at": "2025-01-01T00:00:00Z",
      "premium": false
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 900
    }
  }
}
```

#### POST /auth/refresh

Refresh access token using refresh token.

**Request Body**:

```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /auth/register

Create new user account.

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "username": "newotaku",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

#### POST /auth/logout

Invalidate current session and refresh token.

#### POST /auth/forgot-password

Request password reset email.

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password

Reset password using reset token.

**Request Body**:

```json
{
  "token": "reset_token_here",
  "password": "newsecurepassword",
  "confirm_password": "newsecurepassword"
}
```

## Library Management

### GET /library

Get user's library with pagination and filtering.

**Query Parameters**:

- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20, max: 100)
- `sort` (string): Sort field (title, created_at, updated_at, progress)
- `order` (string): Sort order (asc, desc)
- `type` (string): Media type filter (manga, anime, light_novel)
- `status` (string): Reading status (reading, completed, on_hold, dropped, plan_to_read)
- `search` (string): Search query

**Response**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "media_123",
        "title": "One Piece",
        "type": "manga",
        "status": "reading",
        "progress": {
          "current_chapter": 1050,
          "total_chapters": 1090,
          "current_page": 15,
          "last_read": "2025-07-10T15:30:00Z"
        },
        "metadata": {
          "author": "Eiichiro Oda",
          "genres": ["Action", "Adventure", "Comedy"],
          "year": 1997,
          "description": "The story follows the adventures of Monkey D. Luffy...",
          "cover": "https://example.com/covers/one_piece.jpg"
        },
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-07-10T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### POST /library

Add new media to library.

**Request Body**:

```json
{
  "source": "local", // or extension source id
  "path": "/path/to/manga", // for local files
  "url": "https://source.com/manga/123", // for external sources
  "metadata": {
    "title": "Custom Title",
    "author": "Author Name",
    "description": "Custom description"
  }
}
```

### GET /library/{id}

Get detailed information about a specific media item.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "media_123",
    "title": "One Piece",
    "type": "manga",
    "status": "reading",
    "progress": {
      "current_chapter": 1050,
      "total_chapters": 1090,
      "current_page": 15,
      "last_read": "2025-07-10T15:30:00Z",
      "reading_time": 72000 // seconds
    },
    "metadata": {
      "author": "Eiichiro Oda",
      "genres": ["Action", "Adventure", "Comedy"],
      "year": 1997,
      "status": "ongoing",
      "description": "The story follows the adventures...",
      "cover": "https://example.com/covers/one_piece.jpg",
      "background": "https://example.com/backgrounds/one_piece.jpg",
      "rating": 9.2,
      "popularity": 95000
    },
    "chapters": [
      {
        "id": "chapter_1",
        "number": 1,
        "title": "Romance Dawn",
        "pages": 19,
        "read": true,
        "date_published": "1997-07-22",
        "url": "/reader/media_123/chapter_1"
      }
    ],
    "statistics": {
      "total_reading_time": 72000,
      "pages_read": 15432,
      "chapters_read": 1050,
      "reading_streak": 45
    },
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-07-10T15:30:00Z"
  }
}
```

### PUT /library/{id}

Update media information.

**Request Body**:

```json
{
  "status": "completed",
  "metadata": {
    "title": "Updated Title",
    "custom_cover": "base64_image_data"
  },
  "progress": {
    "current_chapter": 1090,
    "current_page": 1
  }
}
```

### DELETE /library/{id}

Remove media from library.

### POST /library/{id}/progress

Update reading progress.

**Request Body**:

```json
{
  "chapter": 1051,
  "page": 10,
  "timestamp": "2025-07-11T10:00:00Z"
}
```

## Reader API

### GET /reader/{media_id}/chapter/{chapter_id}

Get chapter pages for reading.

**Response**:

```json
{
  "success": true,
  "data": {
    "chapter": {
      "id": "chapter_1051",
      "number": 1051,
      "title": "The World's End and Beginning",
      "pages": 17,
      "previous_chapter": "chapter_1050",
      "next_chapter": "chapter_1052"
    },
    "pages": [
      {
        "page": 1,
        "url": "https://example.com/reader/page_1.jpg",
        "width": 800,
        "height": 1200
      }
    ],
    "reading_settings": {
      "reading_mode": "single_page",
      "reading_direction": "left_to_right",
      "fit_mode": "fit_width"
    }
  }
}
```

### POST /reader/{media_id}/chapter/{chapter_id}/bookmark

Add bookmark to current page.

**Request Body**:

```json
{
  "page": 5,
  "note": "Great scene here!"
}
```

## Download Management

### GET /downloads

Get download queue and history.

**Query Parameters**:

- `status` (string): Filter by status (pending, downloading, completed, failed, paused)
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response**:

```json
{
  "success": true,
  "data": {
    "downloads": [
      {
        "id": "download_123",
        "media_id": "media_456",
        "title": "New Manga Chapter 100",
        "type": "chapter",
        "status": "downloading",
        "progress": {
          "downloaded": 15,
          "total": 20,
          "percentage": 75,
          "speed": "2.5 MB/s",
          "eta": "00:02:30"
        },
        "source": "extension_mangadex",
        "created_at": "2025-07-11T10:00:00Z",
        "started_at": "2025-07-11T10:05:00Z"
      }
    ],
    "statistics": {
      "total_downloads": 1250,
      "completed": 1200,
      "failed": 15,
      "queue_size": 5,
      "total_size": "50.2 GB"
    }
  }
}
```

### POST /downloads

Add new download to queue.

**Request Body**:

```json
{
  "source": "extension_mangadex",
  "media_id": "media_456",
  "chapters": [100, 101, 102], // specific chapters
  "quality": "high", // low, medium, high
  "priority": "normal" // low, normal, high
}
```

### PUT /downloads/{id}

Update download (pause, resume, cancel).

**Request Body**:

```json
{
  "action": "pause" // pause, resume, cancel, retry
}
```

### DELETE /downloads/{id}

Remove download from queue and delete files.

## Extension System

### GET /extensions

Get available extensions.

**Response**:

```json
{
  "success": true,
  "data": {
    "extensions": [
      {
        "id": "extension_mangadex",
        "name": "MangaDex",
        "version": "1.2.5",
        "author": "MangaDex Team",
        "description": "Official MangaDex extension",
        "icon": "https://example.com/icons/mangadex.png",
        "source_types": ["manga"],
        "languages": ["en", "jp", "es", "fr"],
        "status": "enabled",
        "installed": true,
        "update_available": false,
        "rating": 4.8,
        "downloads": 50000
      }
    ],
    "categories": [
      {
        "name": "Manga Sources",
        "count": 25
      },
      {
        "name": "Anime Sources",
        "count": 15
      }
    ]
  }
}
```

### POST /extensions/{id}/install

Install extension.

### PUT /extensions/{id}/toggle

Enable/disable extension.

**Request Body**:

```json
{
  "enabled": true
}
```

### GET /extensions/{id}/search

Search using specific extension.

**Query Parameters**:

- `q` (string): Search query
- `page` (integer): Page number
- `filters` (object): Extension-specific filters

**Response**:

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "manga_123",
        "title": "Popular Manga",
        "cover": "https://example.com/cover.jpg",
        "author": "Famous Author",
        "status": "ongoing",
        "last_chapter": "Chapter 150",
        "rating": 9.1,
        "tags": ["Action", "Adventure"]
      }
    ],
    "pagination": {
      "page": 1,
      "has_next": true
    }
  }
}
```

## User Management

### GET /user/profile

Get current user profile.

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "otakufan",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "premium": false,
    "settings": {
      "theme": "dark",
      "language": "en",
      "reading_mode": "single_page",
      "auto_download": true,
      "notifications": {
        "new_chapters": true,
        "download_complete": true,
        "system_updates": false
      }
    },
    "statistics": {
      "total_reading_time": 360000,
      "manga_read": 450,
      "chapters_read": 15000,
      "pages_read": 250000,
      "reading_streak": 45,
      "favorite_genres": ["Action", "Adventure", "Comedy"]
    },
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### PUT /user/profile

Update user profile.

**Request Body**:

```json
{
  "username": "newusername",
  "avatar": "base64_image_data",
  "settings": {
    "theme": "light",
    "language": "jp"
  }
}
```

### GET /user/statistics

Get detailed user statistics.

### GET /user/reading-history

Get reading history with pagination.

## Search API

### GET /search

Global search across library and extensions.

**Query Parameters**:

- `q` (string): Search query
- `type` (string): Content type (manga, anime, light_novel, all)
- `sources` (array): Sources to search (library, extension_ids)
- `filters` (object): Advanced filters

**Response**:

```json
{
  "success": true,
  "data": {
    "library_results": [
      {
        "id": "media_123",
        "title": "One Piece",
        "type": "manga",
        "relevance": 0.95,
        "source": "library"
      }
    ],
    "extension_results": [
      {
        "source": "extension_mangadex",
        "results": [
          {
            "id": "external_456",
            "title": "Similar Manga",
            "relevance": 0.85
          }
        ]
      }
    ],
    "suggestions": ["One Piece", "One Punch Man", "One Piece Film"]
  }
}
```

## Tracking Integration

### GET /tracking/services

Get available tracking services.

**Response**:

```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "myanimelist",
        "name": "MyAnimeList",
        "connected": true,
        "username": "otakufan123",
        "sync_enabled": true,
        "last_sync": "2025-07-11T08:00:00Z"
      },
      {
        "id": "anilist",
        "name": "AniList",
        "connected": false
      }
    ]
  }
}
```

### POST /tracking/{service}/connect

Connect tracking service.

### POST /tracking/{service}/sync

Manual sync with tracking service.

### PUT /tracking/{service}/settings

Update tracking service settings.

## Community Features

### GET /community/reviews/{media_id}

Get reviews for media.

### POST /community/reviews

Create new review.

**Request Body**:

```json
{
  "media_id": "media_123",
  "rating": 9,
  "title": "Amazing manga!",
  "content": "This manga is absolutely incredible...",
  "spoiler": false
}
```

### GET /community/collections

Get public collections.

### POST /community/collections

Create new collection.

## Admin API

### GET /admin/stats

Get system statistics (admin only).

### GET /admin/users

Get user management interface (admin only).

### POST /admin/extensions/approve

Approve extension for marketplace (admin only).

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "request_id": "req_123456789"
  }
}
```

### Common Error Codes

| Code                  | Status | Description                     |
| --------------------- | ------ | ------------------------------- |
| `VALIDATION_ERROR`    | 400    | Request validation failed       |
| `UNAUTHORIZED`        | 401    | Authentication required         |
| `FORBIDDEN`           | 403    | Insufficient permissions        |
| `NOT_FOUND`           | 404    | Resource not found              |
| `RATE_LIMITED`        | 429    | Rate limit exceeded             |
| `SERVER_ERROR`        | 500    | Internal server error           |
| `SERVICE_UNAVAILABLE` | 503    | Service temporarily unavailable |

## Rate Limiting

Default rate limits per user:

- **Authentication**: 10 requests per minute
- **API Calls**: 1000 requests per hour
- **Download Requests**: 50 requests per minute
- **Search Requests**: 100 requests per minute

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600
```

## Webhooks

### Webhook Events

Register webhooks to receive real-time notifications:

- `download.completed`
- `download.failed`
- `library.item_added`
- `progress.updated`
- `extension.installed`

### Webhook Payload Example

```json
{
  "event": "download.completed",
  "timestamp": "2025-07-11T10:30:00Z",
  "data": {
    "download_id": "download_123",
    "media_id": "media_456",
    "title": "Manga Chapter 100",
    "size": "15.2 MB"
  }
}
```

## GraphQL API

For advanced queries, use our GraphQL endpoint:

**Endpoint**: `/graphql`

**Example Query**:

```graphql
query GetLibraryWithProgress($limit: Int!) {
  library(limit: $limit) {
    items {
      id
      title
      type
      progress {
        currentChapter
        totalChapters
        percentage
      }
      metadata {
        cover
        author
        genres
      }
    }
    pagination {
      total
      hasNext
    }
  }
}
```

This API reference provides comprehensive documentation for integrating with Project Myriad. For additional examples and SDKs, visit our [Developer Portal](https://developers.project-myriad.com).
