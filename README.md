# Uplink - URL Shortener

A modern, full-stack URL shortening service built with Next.js 15, React, Supabase (Auth + PostgreSQL), Tailwind CSS, and shadcn/ui components. Users can create accounts, shorten URLs with custom slugs, and track click analytics.

## Features

- ✅ **User Authentication**: Sign up and sign in with Supabase Auth
- ✅ **URL Shortening**: Create shortened URLs with auto-generated or custom slugs
- ✅ **Temporary & Permanent Links**: Choose between 30-day temporary or permanent links
- ✅ **Click Analytics**: Track clicks and view detailed analytics for each link
- ✅ **Custom Domains**: Support for multiple domains (uplink.neopanda.tech, meetra.live, etc.)
- ✅ **Public Redirects**: Public endpoint to redirect from short URL to original URL
- ✅ **Responsive UI**: Beautiful UI with shadcn/ui components and Tailwind CSS
- ✅ **Vercel Deployment Ready**: Optimized for Vercel deployment

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available at https://supabase.com)
- Vercel account (for deployment)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to initialize
3. Navigate to the SQL Editor and run the SQL schema:
   - Copy the contents of `sql-schema.sql`
   - Paste into the SQL Editor in Supabase
   - Click "Run"

4. Get your Supabase credentials:
   - Go to Settings → API
   - Copy "Project URL" and "anon key"

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SHORT_URL_BASE=https://uplink.neopanda.tech
NEXT_PUBLIC_SHORT_URL_DOMAINS=uplink.neopanda.tech,meetra.live,localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 in your browser.

## Project Structure

```
uplink/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── (auth)/                 # Auth route group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/            # Protected dashboard routes
│   │   ├── dashboard/page.tsx  # Main dashboard
│   │   └── links/[id]/page.tsx # Link analytics
│   ├── api/
│   │   ├── links/              # Link CRUD operations
│   │   │   ├── route.ts        # POST (create), GET (list)
│   │   │   └── [id]/route.ts   # DELETE, GET (detail)
│   │   └── redirect/           # Analytics tracking
│   │       └── [code]/route.ts # Redirect endpoint
│   └── [code]/page.tsx         # Public catch-all redirect
├── components/
│   ├── Navigation.tsx          # Top navigation
│   ├── ui/                     # shadcn/ui components
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── dashboard/
│       ├── CreateLinkForm.tsx
│       ├── LinkCard.tsx
│       └── LinkList.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── types.ts           # Types
│   ├── urlShortener.ts        # Shortening logic
│   └── utils.ts               # Utility functions
├── middleware.ts              # Auth middleware
└── sql-schema.sql            # Database schema
```

## API Endpoints

### Links
- `POST /api/links` - Create new shortened URL
  - Body: `{ originalUrl: string, customSlug?: string, isPermanent?: boolean }`
  
- `GET /api/links` - Get user's shortened URLs
  
- `DELETE /api/links/[id]` - Delete a shortened URL
  
- `GET /api/links/[id]` - Get link details with recent clicks

### Redirect
- `GET /api/redirect/[code]` - Redirect to original URL and track click
- `GET /[code]` - Catch-all page for redirects

## Database Schema

### short_urls Table
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to auth.users
- `original_url` (TEXT): Original long URL
- `short_code` (VARCHAR): Unique short code
- `custom_slug` (VARCHAR): Optional custom slug
- `created_at` (TIMESTAMP): Creation time
- `updated_at` (TIMESTAMP): Last update time
- `expires_at` (TIMESTAMP): Expiration time (null for permanent)
- `is_permanent` (BOOLEAN): Whether link is permanent
- `click_count` (INT): Total clicks

### url_clicks Table
- `id` (UUID): Primary key
- `short_url_id` (UUID): Foreign key to short_urls
- `clicked_at` (TIMESTAMP): Click time
- `referrer` (TEXT): HTTP referrer
- `user_agent` (TEXT): Browser user agent

## Custom Domains Setup

To use custom domains (uplink.neopanda.tech, meetra.live):

### For Vercel Deployment:
1. Add the domains in Vercel project settings
2. Update DNS records at your domain registrar
3. Update `.env.local` with your domain

### For Local Development:
Update your `/etc/hosts` file (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 uplink.neopanda.tech
127.0.0.1 meetra.live
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import the repository
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SHORT_URL_BASE`
4. Deploy!

## Features in Detail

### URL Shortening
- User enters a long URL
- System generates unique 8-character base62 code or accepts custom slug (2-50 chars)
- Validates custom slug is unique before creating link
- Returns short URL immediately

### Analytics Tracking
- When someone clicks the short URL, the system records:
  - Timestamp
  - Referrer (HTTP header)
  - User agent (browser info)
- Click count is incremented
- User can view analytics dashboard with click statistics and recent clicks

### Expiration
- Default: 30 days (temporary)
- Optional: Permanent (no expiration)
- Expired links return 410 Gone status

## Security Features

- **Row Level Security (RLS)**: Users can only see/manage their own links
- **Authentication**: All protected routes require login
- **HTTPS**: All traffic encrypted
- **Input Validation**: URLs and custom slugs validated
- **Environment Variables**: Secrets not exposed in client code

## License

MIT

## Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
