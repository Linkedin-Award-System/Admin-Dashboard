/**
 * Application Configuration
 * 
 * Centralizes access to environment variables and provides type-safe configuration.
 * All environment variables must be prefixed with VITE_ to be exposed to the client.
 */

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

/**
 * Get environment variable with fallback
 */
function getEnvVar(key: string, defaultValue: string): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Get environment variable as number with fallback
 */
function getEnvNumber(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

/**
 * Get environment variable as boolean with fallback
 */
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  return value ? value === 'true' : defaultValue;
}

/**
 * Application configuration object
 */
export const config: AppConfig = {
  env: getEnvVar('VITE_APP_ENV', 'development') as AppConfig['env'],
  
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:4000/api'),
    timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    maxRetries: getEnvNumber('VITE_API_MAX_RETRIES', 3),
  },
  
  query: {
    staleTime: getEnvNumber('VITE_QUERY_STALE_TIME', 30000),
    cacheTime: getEnvNumber('VITE_QUERY_CACHE_TIME', 300000),
  },
  
  features: {
    analytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
    debugMode: getEnvBoolean('VITE_ENABLE_DEBUG_MODE', false),
  },
};

/**
 * Check if running in development mode
 */
export const isDevelopment = config.env === 'development';

/**
 * Check if running in production mode
 */
export const isProduction = config.env === 'production';

/**
 * Check if running in staging mode
 */
export const isStaging = config.env === 'staging';

/**
 * Log configuration on startup (only in development)
 */
if (isDevelopment && config.features.debugMode) {
  console.log('App Configuration:', config);
}
