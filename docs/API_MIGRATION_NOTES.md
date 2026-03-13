# API Integration Migration Notes

## Overview
This document outlines the differences between the original specification and the actual API implementation, along with required code changes.

## Key Differences

### 1. Authentication

**Original Spec:**
- Endpoint: `/auth/login`
- Method: httpOnly cookies for token storage

**Actual API:**
- Endpoint: `/admin/auth/login`
- Method: Bearer token in Authorization header
- Token returned in response body: `response.data.token`

**Required Changes:**
- ✅ Update auth service to use `/admin/auth/login`
- ✅ Store token in localStorage/sessionStorage (not cookies)
- ✅ Update API client to send `Authorization: Bearer <token>` header
- ✅ Update auth store to handle token from response body

### 2. Admin Endpoint Prefix

**Original Spec:**
- Direct endpoints: `/categories`, `/nominees`, etc.

**Actual API:**
- All admin endpoints prefixed: `/admin/categories`, `/admin/nominees`, etc.

**Required Changes:**
- ✅ Update all service endpoints to include `/admin/` prefix
- Categories: `/admin/categories`
- Nominees: `/admin/nominees`
- Votes: `/admin/votes`
- Payments: `/admin/payments`
- Content: `/admin/content/*`
- Dashboard: `/admin/dashboard`

### 3. Nominee Field Names

**Original Spec:**
```typescript
{
  name: string;
  linkedInUrl: string;
  description: string;
  imageUrl: string;
  categoryIds: string[];
}
```

**Actual API:**
```typescript
{
  fullName: string;
  linkedInProfileUrl: string;
  shortBiography: string;
  profileImageUrl: string;
  organization: string;
  categoryIds: string[];
}
```

**Required Changes:**
- ✅ Update Nominee interface in types
- ✅ Update NomineeForm field names
- ✅ Update NomineeList display fields
- ✅ Update validation schemas

### 4. HTTP Methods

**Original Spec:**
- Update operations: `PUT`

**Actual API:**
- Update operations: `PATCH`

**Required Changes:**
- ✅ Update category service: use `PATCH` for updates
- ✅ Update nominee service: use `PATCH` for updates

### 5. Response Format

**Actual API Response Structure:**
```typescript
{
  data: T;              // Actual data
  message?: string;     // Optional success message
  timestamp: string;    // ISO timestamp
}
```

**Error Response Structure:**
```typescript
{
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}
```

**Required Changes:**
- ✅ API client already handles `response.data.data` extraction
- ✅ Error handling already maps to user-friendly messages

### 6. Voting & Analytics

**Actual API Provides:**
- Dashboard endpoint: `GET /admin/dashboard`
- Votes list with pagination: `GET /admin/votes?page=1&limit=50`
- Server-side CSV export: `GET /admin/votes/export`
- Date range filtering via query params: `startDate`, `endDate`

**Required Changes:**
- ✅ Update voting service to use `/admin/dashboard` for stats
- ✅ Update voting service to use `/admin/votes` with pagination
- ✅ Add pagination support to vote list components
- ✅ Use server CSV export instead of client-side generation

### 7. Payment Tracking

**Actual API Provides:**
- Payments list with pagination: `GET /admin/payments?page=1&limit=50`
- Status filtering: `?status=COMPLETED`
- Server-side CSV export: `GET /admin/payments/export`

**Required Changes:**
- ✅ Update payment service to use `/admin/payments` with pagination
- ✅ Add pagination support to payment list
- ✅ Use server CSV export endpoint

### 8. Content Management

**Actual API Structure:**
- Settings endpoint: `GET /admin/content/settings`
- Sponsors: `GET /admin/content/sponsors`, `POST /admin/content/sponsors`
- Banners: `GET /admin/content/banners`

**Note:** The API structure differs from the original spec's landing page content management approach.

**Required Changes:**
- ⚠️ Review content management implementation
- ⚠️ May need to adapt to settings-based approach
- ⚠️ Verify version history support with backend team

### 9. File Upload

**Actual API:**
- Endpoint: `POST /admin/uploads`
- Method: multipart/form-data
- Bucket types: GENERAL, NOMINEES, SPONSORS, BANNERS
- Returns: `{ url, filename, size, mimeType }`

**Required Changes:**
- ✅ Update ImageManager to use `/admin/uploads`
- ✅ Add bucket parameter to upload requests
- ✅ Handle multipart/form-data uploads

### 10. Export Functionality

**Actual API:**
- Server provides CSV export endpoints
- Votes: `GET /admin/votes/export`
- Payments: `GET /admin/payments/export`
- Supports query parameter filtering

**Required Changes:**
- ✅ Update export service to use server endpoints
- ✅ Remove client-side CSV generation (or keep as fallback)
- ✅ Handle file download from server response

## Implementation Priority

### High Priority (Core Functionality)
1. ✅ Update authentication endpoints and token handling
2. ✅ Add `/admin/` prefix to all service endpoints
3. ✅ Update nominee field names throughout the app
4. ✅ Change PUT to PATCH for update operations

### Medium Priority (Features)
5. ⚠️ Add pagination support to votes and payments
6. ⚠️ Update export functionality to use server endpoints
7. ⚠️ Update dashboard to use `/admin/dashboard` endpoint
8. ⚠️ Implement file upload with multipart/form-data

### Low Priority (Polish)
9. ⚠️ Review and adapt content management approach
10. ⚠️ Add date range filtering to analytics
11. ⚠️ Implement proper error handling for all new endpoints

## Testing Checklist

- [ ] Test admin login with actual API
- [ ] Test category CRUD operations
- [ ] Test nominee CRUD operations with new field names
- [ ] Test voting dashboard data display
- [ ] Test payment list with pagination
- [ ] Test CSV export downloads
- [ ] Test file upload functionality
- [ ] Test error handling for all endpoints
- [ ] Test authentication token expiration
- [ ] Test unauthorized access handling

## Environment Configuration

**Production API:**
```
VITE_API_BASE_URL=https://linkedin-creative-awards-api-production.up.railway.app/api
```

**Local Development:**
```
VITE_API_BASE_URL=http://localhost:4000/api
```

## Next Steps

1. Review this migration guide with the team
2. Update services to match actual API endpoints
3. Test each module with the production API
4. Update type definitions to match API responses
5. Coordinate with backend team on any missing features
6. Update documentation with actual API behavior

## Questions for Backend Team

1. Is version history supported for content management?
2. What's the maximum file size for uploads?
3. Are there rate limits on the API?
4. Is there a staging environment available for testing?
5. What's the token expiration time?
6. Is refresh token functionality available?
7. Are there any CORS restrictions we should know about?

---

**Last Updated:** 2024-01-01
**Status:** In Progress
