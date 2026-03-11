# Environment Variables Documentation

## Overview

The LinkedIn Awards Admin Dashboard uses environment variables to configure different aspects of the application for various environments (development, staging, production).

## Environment Files

The application supports multiple environment files:

| File | Purpose | When Used |
|------|---------|-----------|
| `.env` | Local development overrides | Always loaded (gitignored) |
| `.env.example` | Template with all variables | Reference for developers |
| `.env.development` | Development defaults | `--mode development` |
| `.env.staging` | Staging configuration | `--mode staging` |
| `.env.production` | Production configuration | `--mode production` |

## Variable Naming Convention

All environment variables must be prefixed with `VITE_` to be exposed to the client-side code. This is a Vite security feature that prevents accidentally exposing sensitive server-side variables.

## Available Variables

### Application Environment

#### `VITE_APP_ENV`
- **Type**: `string`
- **Values**: `development` | `staging` | `production`
- **Default**: `development`
- **Description**: Identifies the current environment
- **Example**: `VITE_APP_ENV=production`

### API Configuration

#### `VITE_API_BASE_URL`
- **Type**: `string` (URL)
- **Default**: `http://localhost:3000/api`
- **Description**: Base URL for all API requests
- **Examples**:
  - Development: `http://localhost:3000/api`
  - Staging: `https://staging-api.linkedinwards.et/api`
  - Production: `https://api.linkedinwards.et/api`

#### `VITE_API_TIMEOUT`
- **Type**: `number` (milliseconds)
- **Default**: `30000` (30 seconds)
- **Description**: Maximum time to wait for API responses
- **Example**: `VITE_API_TIMEOUT=30000`
- **Notes**: Increase for slow networks or large data transfers

#### `VITE_API_MAX_RETRIES`
- **Type**: `number`
- **Default**: `3`
- **Description**: Maximum number of retry attempts for failed API requests
- **Example**: `VITE_API_MAX_RETRIES=3`
- **Notes**: Uses exponential backoff (100ms, 200ms, 400ms)

### React Query Configuration

#### `VITE_QUERY_STALE_TIME`
- **Type**: `number` (milliseconds)
- **Default**: `30000` (30 seconds)
- **Description**: Time before cached data is considered stale
- **Example**: `VITE_QUERY_STALE_TIME=30000`
- **Notes**: Lower values = more frequent refetches, higher values = better performance

#### `VITE_QUERY_CACHE_TIME`
- **Type**: `number` (milliseconds)
- **Default**: `300000` (5 minutes)
- **Description**: Time to keep unused data in cache
- **Example**: `VITE_QUERY_CACHE_TIME=300000`
- **Notes**: Previously called `cacheTime` in React Query v4

### Feature Flags

#### `VITE_ENABLE_ANALYTICS`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable analytics tracking
- **Example**: `VITE_ENABLE_ANALYTICS=true`
- **Notes**: Should be `true` in staging and production

#### `VITE_ENABLE_DEBUG_MODE`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enable debug logging and development tools
- **Example**: `VITE_ENABLE_DEBUG_MODE=true`
- **Notes**: Should only be `true` in development

## Environment-Specific Configurations

### Development Environment

```env
# .env.development
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_API_MAX_RETRIES=3
VITE_QUERY_STALE_TIME=30000
VITE_QUERY_CACHE_TIME=300000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

**Characteristics**:
- Points to local backend
- Debug mode enabled
- Analytics disabled
- Shorter cache times for faster development feedback

### Staging Environment

```env
# .env.staging
VITE_APP_ENV=staging
VITE_API_BASE_URL=https://staging-api.linkedinwards.et/api
VITE_API_TIMEOUT=30000
VITE_API_MAX_RETRIES=3
VITE_QUERY_STALE_TIME=30000
VITE_QUERY_CACHE_TIME=300000
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

**Characteristics**:
- Points to staging backend
- Analytics enabled for testing
- Debug mode disabled
- Production-like configuration

### Production Environment

```env
# .env.production
VITE_APP_ENV=production
VITE_API_BASE_URL=https://api.linkedinwards.et/api
VITE_API_TIMEOUT=30000
VITE_API_MAX_RETRIES=3
VITE_QUERY_STALE_TIME=30000
VITE_QUERY_CACHE_TIME=300000
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
```

**Characteristics**:
- Points to production backend
- Analytics enabled
- Debug mode disabled
- Optimized for performance and security

## Usage in Code

### Accessing Environment Variables

Environment variables are accessed through the centralized configuration module:

```typescript
import { config } from '@/lib/config';

// Access API configuration
const apiUrl = config.api.baseUrl;
const timeout = config.api.timeout;

// Access feature flags
if (config.features.debugMode) {
  console.log('Debug mode enabled');
}

// Check environment
import { isDevelopment, isProduction, isStaging } from '@/lib/config';

if (isDevelopment) {
  // Development-only code
}
```

### Configuration Module

The configuration module (`src/lib/config.ts`) provides:
- Type-safe access to environment variables
- Default values for all variables
- Helper functions for environment checks
- Automatic type conversion (string to number/boolean)

```typescript
interface AppConfig {
  env: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    maxRetries: number;
  };
  query: {
    staleTime: number;
    cacheTime: number;
  };
  features: {
    analytics: boolean;
    debugMode: boolean;
  };
}
```

## Setting Up Environment Variables

### For Local Development

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your local settings:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### For Deployment

#### Vercel
1. Go to Project Settings → Environment Variables
2. Add each variable with appropriate values for each environment
3. Redeploy the application

#### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Add each variable with appropriate values
3. Trigger a new deploy

#### Traditional Hosting
1. Create environment-specific `.env` files
2. Build with the appropriate mode:
   ```bash
   npm run build -- --mode production
   ```
3. Deploy the `dist/` directory

## Building with Specific Environments

### Development Build
```bash
npm run build -- --mode development
```

### Staging Build
```bash
npm run build -- --mode staging
```

### Production Build
```bash
npm run build -- --mode production
# or simply
npm run build
```

## Security Considerations

### ✅ Safe to Expose (Client-Side)
- API base URLs
- Timeout values
- Feature flags
- Public configuration

### ❌ Never Expose (Server-Side Only)
- Database credentials
- API keys and secrets
- Private encryption keys
- Authentication secrets

**Important**: All `VITE_` prefixed variables are embedded in the client-side bundle and visible to users. Never store sensitive information in these variables.

## Troubleshooting

### Variables Not Loading

**Problem**: Environment variables are undefined or using default values

**Solutions**:
1. Ensure variable names are prefixed with `VITE_`
2. Restart the development server after changing `.env` files
3. Check that the `.env` file is in the project root
4. Verify the file is not gitignored (except `.env` itself)

### Wrong Environment Configuration

**Problem**: Application uses wrong environment settings

**Solutions**:
1. Check which `.env` file is being loaded
2. Verify `--mode` flag when building
3. Check `VITE_APP_ENV` value in browser console:
   ```javascript
   console.log(import.meta.env.VITE_APP_ENV)
   ```

### Build-Time vs Runtime

**Problem**: Variables work in development but not in production

**Solution**: Remember that Vite environment variables are embedded at build time, not runtime. You must rebuild the application when changing environment variables.

### Type Errors

**Problem**: TypeScript errors when accessing environment variables

**Solution**: Use the configuration module instead of direct access:
```typescript
// ❌ Don't do this
const url = import.meta.env.VITE_API_BASE_URL;

// ✅ Do this
import { config } from '@/lib/config';
const url = config.api.baseUrl;
```

## Best Practices

1. **Use the Configuration Module**: Always access environment variables through `src/lib/config.ts` for type safety and defaults

2. **Document New Variables**: When adding new environment variables, update:
   - `.env.example`
   - This documentation
   - The configuration module

3. **Provide Defaults**: Always provide sensible default values in the configuration module

4. **Validate on Startup**: The configuration module validates variables on application startup

5. **Environment-Specific Values**: Use different values for development, staging, and production

6. **Never Commit Secrets**: Never commit `.env` files with real credentials to version control

7. **Keep `.env.example` Updated**: Ensure `.env.example` always reflects all required variables

## Adding New Environment Variables

1. **Add to `.env.example`**:
   ```env
   VITE_NEW_FEATURE=false
   ```

2. **Add to environment-specific files**:
   - `.env.development`
   - `.env.staging`
   - `.env.production`

3. **Update configuration module** (`src/lib/config.ts`):
   ```typescript
   export const config = {
     // ... existing config
     features: {
       // ... existing features
       newFeature: getEnvBoolean('VITE_NEW_FEATURE', false),
     },
   };
   ```

4. **Update this documentation**

5. **Update TypeScript types** if needed

## Related Documentation

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [API Client Configuration](./API_CLIENT.md)
- [Deployment Guide](../README.md#deployment)
