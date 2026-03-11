# LinkedIn Creative Awards Ethiopia - Admin Dashboard

A modern, comprehensive web application for managing the LinkedIn Creative Awards Ethiopia platform. Built with React 18+, TypeScript, and a robust tech stack for optimal performance and developer experience.

## Overview

The Admin Dashboard enables administrators to:
- Manage award categories and nominees
- Monitor real-time voting statistics and analytics
- Track payment transactions
- Manage content for the public-facing landing page
- Export data in multiple formats (CSV, PDF)

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **State Management**: 
  - React Query (@tanstack/react-query) for server state
  - Zustand for client state
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Form Management**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Charts**: Recharts
- **Routing**: React Router v6

### Testing
- **Unit Testing**: Vitest + React Testing Library
- **Property-Based Testing**: fast-check
- **Coverage**: Vitest coverage with v8 provider

## Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication
│   ├── categories/    # Category management
│   ├── nominees/      # Nominee management
│   ├── voting/        # Voting monitoring
│   ├── payments/      # Payment tracking
│   ├── content/       # Landing page content
│   └── exports/       # Data export functionality
├── shared/            # Shared resources
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── lib/               # Core libraries
│   ├── api-client.ts  # HTTP client configuration
│   ├── auth-guard.tsx # Route protection
│   └── utils.ts       # Utility functions
└── App.tsx            # Root component
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API server running (default: http://localhost:3000)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

### Run all tests
```bash
npm test
```

### Watch mode (for development)
```bash
npm run test:watch
```

### UI mode (interactive)
```bash
npm run test:ui
```

### Coverage report
```bash
npm run test:coverage
```

## Environment Variables

The application supports multiple environments with specific configurations:

### Development (`.env.development`)
- Local development with debug mode enabled
- API endpoint: `http://localhost:3000/api`
- Analytics disabled

### Staging (`.env.staging`)
- Pre-production testing environment
- API endpoint: `https://staging-api.linkedinwards.et/api`
- Analytics enabled

### Production (`.env.production`)
- Production environment
- API endpoint: `https://api.linkedinwards.et/api`
- Analytics enabled, debug mode disabled

### Available Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_APP_ENV` | Environment name (development/staging/production) | `development` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_API_TIMEOUT` | API request timeout in milliseconds | `30000` |
| `VITE_API_MAX_RETRIES` | Maximum number of retry attempts for failed requests | `3` |
| `VITE_QUERY_STALE_TIME` | React Query stale time in milliseconds | `30000` |
| `VITE_QUERY_CACHE_TIME` | React Query cache time in milliseconds | `300000` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `VITE_ENABLE_DEBUG_MODE` | Enable debug logging | `false` |

### Building for Specific Environments

```bash
# Development
npm run build -- --mode development

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

## Backend Database Configuration

The backend should use the following database configuration:
- **Host**: 127.0.0.1
- **Port**: 3306
- **Database**: linkedin_awards_db
- **User**: root
- **Password**: ********

## Features

### Performance Optimizations
- **Code Splitting**: Route-based lazy loading for all pages reduces initial bundle size
- **React Query Optimizations**: Intelligent cache management and optimistic updates
- **Image Lazy Loading**: Images load only when needed
- **Memoization**: Expensive computations are cached to prevent unnecessary recalculations

### Authentication
- Secure login with JWT tokens (httpOnly cookies)
- Session management with automatic expiration handling
- Protected routes with authentication guards

### Category Management
- Create, edit, and delete award categories
- Alphabetical sorting
- Deletion constraints (prevent deletion if nominees exist)

### Nominee Management
- Add, edit, and remove nominees
- Multi-category association
- LinkedIn profile validation
- Deletion constraints (prevent deletion if votes exist)

### Voting Monitoring
- Real-time voting statistics (30-second polling)
- Vote counts per category and nominee
- Timeline charts showing vote accumulation
- Date range filtering
- Unique voter tracking

### Payment Tracking
- Transaction list with filtering
- Status tracking (pending, completed, failed, refunded)
- Revenue calculation
- Date range filtering

### Content Management
- Rich text editor for landing page content
- Image upload and management
- Content preview before publishing
- Version history with revert capability

### Data Export
- CSV export for categories, nominees, votes, and payments
- PDF reports with charts
- UTF-8 encoding for international characters

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices and hooks patterns
- Use functional components
- Implement proper error handling

### State Management
- Use React Query for server state (caching, polling, mutations)
- Use Zustand for client state (auth, UI state)
- Use React Hook Form for form state

### Testing Strategy
- Write unit tests for components and utilities
- Write property-based tests for correctness properties
- Aim for 80%+ code coverage
- Test user interactions and edge cases

## License

Proprietary - LinkedIn Creative Awards Ethiopia

## Support

For issues or questions, contact the development team.
