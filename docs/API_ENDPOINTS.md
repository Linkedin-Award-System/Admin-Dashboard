# LinkedIn Creative Awards API - Endpoint Documentation

## Base URL
```
Production: https://linkedin-creative-awards-api-production.up.railway.app/api
Local: http://localhost:4000/api
```

## Authentication

### Admin Login
**Endpoint:** `POST /admin/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "ChangeMe123!"
}
```

**Response:**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "admin-id",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  },
  "message": "Login successful"
}
```

**Authentication Method:** Bearer Token
- Include token in Authorization header: `Authorization: Bearer <token>`

### Get Admin Profile
**Endpoint:** `GET /admin/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "data": {
    "id": "admin-id",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Request Password Reset
**Endpoint:** `POST /admin/auth/password-reset/request`

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

---

## Categories

### Get All Categories
**Endpoint:** `GET /admin/categories`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "data": [
    {
      "id": "category-id",
      "name": "Technology",
      "description": "Tech innovations and digital transformation",
      "nomineeCount": 5,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Category
**Endpoint:** `POST /admin/categories`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Technology",
  "description": "Tech innovations and digital transformation"
}
```

**Response:**
```json
{
  "data": {
    "id": "category-id",
    "name": "Technology",
    "description": "Tech innovations and digital transformation",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Category created successfully"
}
```

### Update Category
**Endpoint:** `PATCH /admin/categories/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Technology",
  "description": "Updated description"
}
```

### Delete Category
**Endpoint:** `DELETE /admin/categories/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

---

## Nominees

### Get All Nominees
**Endpoint:** `GET /admin/nominees`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `categoryId` (optional): Filter by category

**Response:**
```json
{
  "data": [
    {
      "id": "nominee-id",
      "fullName": "John Doe",
      "linkedInProfileUrl": "https://linkedin.com/in/johndoe",
      "organization": "Tech Corp",
      "shortBiography": "Innovative tech leader",
      "profileImageUrl": "https://example.com/image.jpg",
      "voteCount": 150,
      "categories": [
        {
          "id": "category-id",
          "name": "Technology"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Create Nominee
**Endpoint:** `POST /admin/nominees`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "linkedInProfileUrl": "https://linkedin.com/in/johndoe",
  "organization": "Tech Corp",
  "shortBiography": "Innovative tech leader",
  "profileImageUrl": "https://example.com/image.jpg",
  "categoryIds": ["category-id-1", "category-id-2"]
}
```

### Update Nominee
**Endpoint:** `PATCH /admin/nominees/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "organization": "Updated Corp",
  "shortBiography": "Updated biography"
}
```

### Delete Nominee
**Endpoint:** `DELETE /admin/nominees/:id`

**Headers:** `Authorization: Bearer <token>`

---

## Voting & Analytics

### Get Dashboard Stats
**Endpoint:** `GET /admin/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "data": {
    "totalVotes": 1500,
    "uniqueVoters": 350,
    "totalRevenue": 25000,
    "categoriesCount": 8,
    "nomineesCount": 45,
    "topNominees": [
      {
        "id": "nominee-id",
        "fullName": "John Doe",
        "voteCount": 250,
        "category": "Technology"
      }
    ]
  }
}
```

### Get All Votes
**Endpoint:** `GET /admin/votes`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `categoryId` (optional)
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
{
  "data": {
    "votes": [
      {
        "id": "vote-id",
        "nomineeId": "nominee-id",
        "categoryId": "category-id",
        "userId": "user-id",
        "quantity": 5,
        "type": "PREMIUM",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1500,
      "totalPages": 30
    }
  }
}
```

### Export Votes CSV
**Endpoint:** `GET /admin/votes/export`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `categoryId` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response:** CSV file download

---

## Payments

### Get All Payments
**Endpoint:** `GET /admin/payments`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `status` (optional): PENDING, COMPLETED, FAILED, REFUNDED
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "data": {
    "payments": [
      {
        "id": "payment-id",
        "txRef": "tx-ref-123",
        "userId": "user-id",
        "amount": 500,
        "currency": "ETB",
        "status": "COMPLETED",
        "packageId": "package-id",
        "createdAt": "2024-01-01T00:00:00Z",
        "completedAt": "2024-01-01T00:05:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 350,
      "totalPages": 7
    }
  }
}
```

### Export Payments CSV
**Endpoint:** `GET /admin/payments/export`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response:** CSV file download

---

## Content Management

### Get Settings
**Endpoint:** `GET /admin/content/settings`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "data": {
    "votingEnabled": true,
    "votingStartDate": "2024-01-01T00:00:00Z",
    "votingEndDate": "2024-12-31T23:59:59Z",
    "landingPageContent": {
      "hero": {
        "heading": "LinkedIn Creative Awards Ethiopia",
        "subheading": "Celebrating excellence in creativity",
        "imageUrl": "https://example.com/hero.jpg"
      },
      "about": {
        "content": "<p>About the awards...</p>"
      }
    }
  }
}
```

### Get Sponsors
**Endpoint:** `GET /admin/content/sponsors`

**Headers:** `Authorization: Bearer <token>`

### Create Sponsor
**Endpoint:** `POST /admin/content/sponsors`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Tech Corp",
  "websiteUrl": "https://techcorp.com",
  "logoUrl": "https://example.com/logo.png"
}
```

### Get Banners
**Endpoint:** `GET /admin/content/banners`

**Headers:** `Authorization: Bearer <token>`

---

## File Upload

### Upload Image
**Endpoint:** `POST /admin/uploads`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: Image file
- `bucket`: GENERAL | NOMINEES | SPONSORS | BANNERS

**Response:**
```json
{
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 102400,
    "mimeType": "image/jpeg"
  }
}
```

---

## Public API (No Authentication Required)

### Get Landing Page Content
**Endpoint:** `GET /public/content/landing`

### Get Public Categories
**Endpoint:** `GET /public/categories`

### Get Public Nominees
**Endpoint:** `GET /public/nominees`

### Get Credit Packages
**Endpoint:** `GET /public/credit-packages`

---

## Health & Status

### Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Cache Status
**Endpoint:** `GET /cache/status`

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": ["Validation error message"]
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Common Error Codes
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `422`: Unprocessable Entity - Validation failed
- `500`: Internal Server Error

---

## Notes

1. **Authentication**: All admin endpoints require Bearer token authentication
2. **Date Formats**: All dates use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
3. **Pagination**: Default page size is 50, maximum is 100
4. **Rate Limiting**: API may implement rate limiting (check response headers)
5. **CORS**: Configured for admin dashboard domain
6. **File Uploads**: Maximum file size is 5MB for images
7. **Response Wrapper**: All successful responses are wrapped in `{ data: ... }` format
