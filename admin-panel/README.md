# Tyre Rewards Admin Panel

A Next.js admin panel for managing users and points in the Tyre Rewards app.

## Features

- View user statistics and analytics
- Search and filter users
- Add or remove points from user accounts
- View transaction history
- Real-time updates

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The admin panel will be available at `http://localhost:3001`

## Structure

- `src/app/` - Next.js 13+ app directory with pages and layouts
- `src/components/` - Reusable UI components
- `src/lib/` - API services and utilities
- `src/types/` - TypeScript type definitions

## API Integration

Currently uses mock data that matches the main app's structure. To integrate with a real backend:

1. Update `src/lib/api.ts` to call actual API endpoints
2. Implement authentication/authorization
3. Add proper error handling and loading states

## Development

The admin panel is designed to work alongside the main React Native app. Both share similar data structures and can be integrated with the same backend services.