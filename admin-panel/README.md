# Tyre Rewards Admin Panel

A Next.js 14 admin dashboard for managing the Tyre Rewards loyalty program. This panel allows administrators to view user statistics, manage user accounts, and adjust reward points.

## Features

- **Secure Authentication**: Supabase Auth integration with email/password login
- **User Management**: View, search, and manage all registered users
- **Points Management**: Add or deduct reward points with transaction descriptions
- **Dashboard Analytics**: Real-time statistics including total users, active users, and points distribution
- **Transaction History**: View recent reward transactions across all users
- **Responsive Design**: Mobile-first UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ installed
- Supabase project created at [supabase.com](https://supabase.com)
- Admin user credentials

## Environment Variables

Create a `.env.local` file in the `admin-panel` directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These values can be found in your Supabase project dashboard under **Settings → API**.

## Installation

1. Navigate to the admin-panel directory:
   ```bash
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see above)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser

## Admin Credentials

The admin user has been created with the following credentials:

- **Email**: `admin@tyrewards.com`
- **Password**: `AdminTyreRewards2025!`

**Important**: Change these credentials after first login in production!

## Project Structure

```
admin-panel/
├── src/
│   ├── app/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── DashboardClient.tsx   # Client component with dashboard logic
│   │   ├── page.tsx              # Server component with auth protection
│   │   ├── layout.tsx            # Root layout
│   │   └── globals.css           # Global styles
│   ├── lib/
│   │   ├── api.ts                # API client for backend
│   │   ├── supabaseClient.ts     # Browser Supabase client
│   │   └── supabaseServer.ts     # Server Supabase client
│   └── types/
│       └── index.ts              # TypeScript type definitions
├── .env.local                    # Environment variables (not in git)
├── package.json
└── README.md
```

## Key Files

### Authentication

- **`src/lib/supabaseClient.ts`**: Browser-side Supabase client for client components
- **`src/lib/supabaseServer.ts`**: Server-side Supabase client with cookie handling
- **`src/app/login/page.tsx`**: Login form with email/password authentication

### Dashboard

- **`src/app/page.tsx`**: Server component that checks authentication and redirects if needed
- **`src/app/DashboardClient.tsx`**: Client component containing all dashboard UI and logic

## Usage

### Logging In

1. Navigate to `/login`
2. Enter admin credentials
3. Click "Log in"
4. You'll be redirected to the dashboard upon success

### Managing Users

1. View all users in the "User Management" panel
2. Use the search bar to filter by name, email, or car registration
3. Click the edit icon next to any user to manage their points

### Adjusting Points

1. Select a user from the User Management panel
2. Enter the points amount:
   - Positive number to add points
   - Negative number to deduct points
3. Enter a description (reason for adjustment)
4. Click "Update Points"

### Viewing Statistics

The dashboard displays:
- **Total Users**: All registered users
- **Active Users**: Users with recent activity
- **Total Tyres Earned**: Sum of all earned rewards
- **Average per User**: Mean reward points across all users

### Logging Out

Click the "Logout" button in the top-right corner to sign out securely.

## Authentication Flow

1. **Server-Side Protection**: The main dashboard page (`src/app/page.tsx`) uses server-side rendering to check authentication status before the page loads.

2. **Redirect Logic**: Unauthenticated users are automatically redirected to `/login`.

3. **Session Management**: Supabase handles session tokens via HTTP-only cookies for security.

4. **Client-Side API Calls**: The dashboard client component makes authenticated API calls to fetch and update data.

## Development

### Running in Development Mode

```bash
npm run dev
```

The admin panel runs on port 3001 to avoid conflicts with the main app (port 3000).

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## API Integration

The admin panel communicates with a backend API (defined in `src/lib/api.ts`) for:

- Fetching user statistics
- Getting user lists
- Updating user points
- Retrieving transaction history

Ensure the backend API is running and accessible for full functionality.

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Admin Credentials**: Change default password immediately in production
3. **HTTPS**: Always use HTTPS in production
4. **Row Level Security**: Enable RLS policies in Supabase for additional security
5. **API Authentication**: Ensure backend API validates admin sessions

## Troubleshooting

### Login Not Working

- Verify Supabase URL and key in `.env.local`
- Check that the admin user exists in Supabase Auth
- Ensure email is confirmed (or disable email confirmation in Supabase settings)

### Data Not Loading

- Check that the backend API is running
- Verify API endpoints in `src/lib/api.ts`
- Check browser console for error messages

### Styling Issues

- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

## License

Private - Internal use only

## Support

For issues or questions, contact the development team.