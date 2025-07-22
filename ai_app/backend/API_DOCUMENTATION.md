# AI App Catalog API Documentation

## Overview

The AI App Catalog API provides endpoints for managing an internal catalog of AI applications. The API supports CRUD operations for applications, user authentication, reviews, favorites, and usage tracking.

## Base URL

- **Development**: `http://localhost:3001/api`
- **API Documentation**: `http://localhost:3001/api-docs`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **Rate Limit**: 100 requests per 15 minutes per IP address
- **Headers**: Rate limit information is included in response headers:
  - `X-RateLimit-Limit`: Maximum number of requests
  - `X-RateLimit-Remaining`: Number of requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": any,        // Present on successful requests
  "error": string,    // Present on error requests
  "message": string   // Additional information
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

Error response example:
```json
{
  "success": false,
  "error": "Validation Error",
  "message": "Name must be between 1 and 200 characters"
}
```

## Endpoints

### Applications

#### GET /apps
List AI applications with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sort_by` (optional): Sort field (name, created_at, updated_at, usage_count, avg_rating)
- `order` (optional): Sort order (asc, desc, default: desc)
- `categories` (optional): Comma-separated category IDs
- `status` (optional): Comma-separated status values
- `tags` (optional): Comma-separated tag IDs
- `search` (optional): Search query for name and description

**Response:**
```json
{
  "success": true,
  "data": {
    "apps": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET /apps/:id
Get a specific application by ID.

**Parameters:**
- `id` (path): Application ID

#### POST /apps
Create a new application. **Requires authentication.**

**Request Body:**
```json
{
  "name": "Application Name",
  "description": "Application description",
  "category_id": 1,
  "status": "development",
  "url": "https://example.com",
  "api_endpoint": "https://api.example.com",
  "model_info": "GPT-4",
  "environment": "Web Browser",
  "usage_guide": "How to use this app...",
  "input_example": "Sample input",
  "output_example": "Sample output",
  "tech_stack": {
    "frontend": ["React", "TypeScript"],
    "backend": ["Node.js", "Express"],
    "ai": ["OpenAI GPT-4"]
  },
  "is_public": true
}
```

#### PUT /apps/:id
Update an application. **Requires authentication and ownership.**

#### DELETE /apps/:id
Delete an application. **Requires authentication and ownership.**

### Reviews

#### GET /apps/:id/reviews
Get reviews for a specific application.

#### POST /apps/:id/reviews
Create a review for an application. **Requires authentication.**

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great application!"
}
```

### Favorites

#### POST /apps/:id/favorite
Add application to favorites. **Requires authentication.**

#### DELETE /apps/:id/favorite
Remove application from favorites. **Requires authentication.**

#### GET /apps/favorites
Get user's favorite applications. **Requires authentication.**

### Usage Tracking

#### POST /apps/:id/usage
Track application usage. **Requires authentication.**

**Request Body:**
```json
{
  "action": "view" // or "use"
}
```

### Categories & Tags

#### GET /categories
Get all categories.

#### GET /tags
Get all tags.

### Popular & Recent

#### GET /apps/popular
Get popular applications based on usage count.

**Query Parameters:**
- `limit` (optional): Number of apps to return (default: 10, max: 50)

#### GET /apps/recent
Get recently created/updated applications.

**Query Parameters:**
- `limit` (optional): Number of apps to return (default: 10, max: 50)

#### GET /apps/search
Search applications by name and description.

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Number of results (default: 20, max: 100)

## Data Models

### Application Status Values
- `development` - Under development
- `testing` - In testing phase  
- `active` - Active and available
- `maintenance` - Under maintenance
- `deprecated` - Deprecated but still available
- `archived` - Archived and not available

### Category Types
- `business` - Business function categories
- `target` - Target user categories  
- `difficulty` - Difficulty level categories

### User Roles
- `user` - Regular user
- `admin` - Administrator
- `super_admin` - Super administrator

## Development Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup:**
   ```bash
   # Run migrations
   psql -U your_user -d ai_app_catalog -f database/migrations/001_create_initial_schema.sql
   
   # Seed data
   psql -U your_user -d ai_app_catalog -f database/seeds/001_initial_data.sql
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

5. **Access API documentation:**
   Open `http://localhost:3001/api-docs` in your browser

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Monitoring

The API includes built-in monitoring capabilities:

- **Health Check**: `GET /health` and `GET /api/health`
- **Logging**: Structured logging with different levels
- **Error Tracking**: Comprehensive error handling and logging

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents abuse with configurable limits
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: Parameterized queries
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers middleware
- **Role-based Access Control**: Different permission levels

## Performance Optimizations

- **Caching**: Redis caching for frequently accessed data
- **Compression**: Response compression middleware  
- **Database Indexing**: Optimized database queries
- **Pagination**: Efficient data pagination
- **Connection Pooling**: Database connection optimization

For more detailed information, visit the interactive API documentation at `/api-docs`.