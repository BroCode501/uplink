# Multi-Domain Dynamic Configuration

## Overview

Uplink now supports dynamic multi-domain configuration! The application automatically detects which domain it's running on and uses that domain for generating shortened links. This means:

- ✅ **One deployment, multiple domains** - Deploy once, access from any domain
- ✅ **Auto-detection** - No hardcoding needed
- ✅ **Seamless switching** - Links work across all configured domains
- ✅ **User-friendly** - Shows which domains are available
- ✅ **No code changes** - Just configure environment variables

---

## How It Works

### Client-Side Auto-Detection

When a user accesses Uplink from any domain, the application:

1. Detects the current domain using `window.location.origin`
2. Validates it against the list of allowed domains
3. Uses that domain as the base URL for shortened links
4. Displays which domain they're currently using

### Server-Side Validation

API routes validate requests using:

1. Request headers (`x-forwarded-host`, `host`)
2. Domain validation against allowed list
3. Fallback to primary domain if validation fails

### Database Agnostic

Since short codes are stored without the domain in the database:

- `short_code: "abc123def"`

They work from ANY domain:

- `https://meetra.live/abc123def`
- `https://uplink.neopanda.tech/abc123def`
- `https://uplink-brocode.vercel.app/abc123def`

All redirect to the same link!

---

## Configuration

### Environment Variables

Set ONE of these two options:

#### Option 1: Single Domain (Legacy)
```env
NEXT_PUBLIC_SHORT_URL_BASE=https://meetra.live
```

#### Option 2: Multiple Domains (NEW - RECOMMENDED)
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech,uplink-brocode.vercel.app
```

**Format:**
- Comma-separated domain names
- Domains WITHOUT `https://` prefix (auto-added)
- No trailing slashes

**Examples:**
```env
# Single domain
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live

# Multiple domains
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech

# With subdomains
NEXT_PUBLIC_SHORT_URL_DOMAINS=short.example.com,url.example.com,links.example.com

# Port numbers (for local dev)
NEXT_PUBLIC_SHORT_URL_DOMAINS=localhost:3000,localhost:3001
```

---

## Vercel Deployment

### Setup in Vercel

1. Go to your Vercel project
2. Click Settings → Environment Variables
3. Add the variable:

```
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech
```

4. Set scope: Production, Preview, Development
5. Save and redeploy

### Local Development (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmpnefwcziwjkibquvey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
NEXT_PUBLIC_SHORT_URL_DOMAINS=localhost:3000
```

---

## API Endpoints

### Get Domain Configuration

**Endpoint:** `GET /api/config/domains`

**Response:**
```json
{
  "success": true,
  "data": {
    "totalDomains": 3,
    "domains": [
      "https://meetra.live",
      "https://uplink.neopanda.tech",
      "https://uplink-brocode.vercel.app"
    ],
    "currentDomain": "https://meetra.live",
    "isPrimary": true
  }
}
```

Safe to call from frontend - no sensitive data exposed.

---

## Features

### Dashboard Domain Info

The dashboard now displays:

- **Current Domain** - Which domain you're accessing from
- **All Configured Domains** - List of all available domains
- **Primary Domain** - The first domain in the list (fallback)
- **Visual Indicators** - Shows which is current and primary

### Auto-Detection in Forms

When users create a link:

- Their current domain is detected automatically
- The shortened URL uses their current domain
- No selection needed!

### Cross-Domain Links

Users can access links from any configured domain:

1. User creates link on `meetra.live`
   - Short URL: `https://meetra.live/abc123`
   
2. User shares with friend
   - Friend accesses from `uplink.neopanda.tech`
   - Can view/manage the link
   - Can access the shortened URL from any domain

---

## Utility Functions

The `lib/domain-config.ts` file provides utilities:

```typescript
// Get current domain from request or window
getCurrentDomain(request?: Request | string): string

// Get list of allowed domains
getAllowedDomains(): string[]

// Validate if a domain is allowed
isAllowedDomain(domain: string): boolean

// Get the current request's short URL base
getShortUrlBase(request?: Request | string): string

// Format a short code as a complete URL
formatShortUrl(shortCode: string, baseUrl?: string): string

// Extract short code from a URL
extractShortCode(url: string): string | null

// Get domain statistics
getDomainStats(): {
  totalDomains: number;
  domains: string[];
  isPrimary: (domain: string) => boolean;
}
```

**Usage in Components:**

```typescript
import { getCurrentDomain, formatShortUrl } from '@/lib/domain-config';

// Auto-detect current domain
const domain = getCurrentDomain(); // "https://meetra.live"

// Format a short code
const url = formatShortUrl('abc123'); // "https://meetra.live/abc123"
```

---

## Examples

### Example 1: Two Production Domains

**Setup:**
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech
```

**Behavior:**
- User accesses `https://meetra.live` → Links created start with `meetra.live`
- User accesses `https://uplink.neopanda.tech` → Links created start with `uplink.neopanda.tech`
- Both can access/manage the same links
- All links work from either domain

### Example 2: Three Domains (Production + Staging + Dev)

**Setup:**
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech,uplink-brocode.vercel.app
```

**Behavior:**
- Production team uses `meetra.live`
- Alternative deployment on `uplink.neopanda.tech`
- Development/testing on `uplink-brocode.vercel.app`
- All share same database and work seamlessly

### Example 3: Local Development with Multiple Ports

**Setup:**
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=localhost:3000,localhost:3001
```

**Behavior:**
- Run same app on multiple ports for testing
- Each port generates links with its own domain
- Test cross-domain scenarios locally

---

## Migration from Single Domain

If you're currently using single domain setup:

### Before (Old):
```env
NEXT_PUBLIC_SHORT_URL_BASE=https://meetra.live
```

### After (New):
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live
```

**Or multiple:**
```env
NEXT_PUBLIC_SHORT_URL_DOMAINS=meetra.live,uplink.neopanda.tech
```

### Backward Compatibility

Old `NEXT_PUBLIC_SHORT_URL_BASE` is still supported as fallback:

1. If `NEXT_PUBLIC_SHORT_URL_DOMAINS` is set, use it
2. If not set, use `NEXT_PUBLIC_SHORT_URL_BASE`
3. If neither, fallback to `meetra.live`

---

## Testing

### Test Current Domain Detection

1. Go to dashboard
2. Look for "Instance Domains" card
3. Should show your current domain
4. Should show all configured domains

### Test Auto-Detection in Links

1. Access app from different domain
2. Create a short link
3. Check URL - should use that domain
4. Verify link works from other domains

### Test from Multiple Domains Locally

```bash
# Terminal 1
npm run dev

# Terminal 2 - Add entry to /etc/hosts
# 127.0.0.1 localhost.test

# Then access:
# http://localhost:3000
# http://localhost.test:3000
```

---

## Troubleshooting

### Links Show Wrong Domain

**Problem:** Creating link on `meetra.live` but it shows `uplink.neopanda.tech`

**Solution:**
1. Check browser console for current domain
2. Verify `NEXT_PUBLIC_SHORT_URL_DOMAINS` environment variable
3. Ensure domain is in the list
4. Hard refresh browser (Ctrl+Shift+R)

### Domain Not in List

**Problem:** "Domain not in allowed list" error

**Solution:**
1. Check which domain you're accessing from
2. Add it to `NEXT_PUBLIC_SHORT_URL_DOMAINS`
3. Redeploy
4. Wait for deployment to complete

### Links Broken After Domain Change

**Problem:** Changed domain but old links don't work

**Solution:**
- This shouldn't happen! Old links still work because short codes are domain-agnostic
- If links are broken, check if the redirect route is working
- Verify database still has the short_urls records

---

## Dashboard Display

The "Instance Domains" card shows:

```
Instance Domains
You're accessing from: https://meetra.live

Configured Domains (3)
[meetra.live (Primary) (Current)] [uplink.neopanda.tech] [uplink-brocode.vercel.app]

Short links work seamlessly across all configured domains. 
Links created on any domain are accessible from all domains.
```

---

## Architecture

### File Structure

```
lib/
├── domain-config.ts          # Core domain utilities
└── supabase/

components/
├── DomainInfo.tsx            # Domain info display component
└── dashboard/
   ├── CreateLinkForm.tsx     # Uses auto-detection
   └── LinkCard.tsx           # Uses auto-detection

app/
├── api/
│  └── config/
│     └── domains/
│        └── route.ts         # Domain config endpoint
└── (dashboard)/
   └── dashboard/
      └── page.tsx            # Includes DomainInfo
```

---

## Best Practices

✅ **DO:**
- Use comma-separated format: `domain1.com,domain2.com`
- Include all possible domains users might access from
- Test on all domains after deployment
- Document your domain setup in team wiki

❌ **DON'T:**
- Mix protocols: don't do `https://domain1.com,domain2.com`
- Use trailing slashes: don't do `domain.com/`
- Hard-code domains in components
- Include port numbers in production (use proxy)

---

## FAQ

**Q: Do I need one deployment per domain?**
A: No! One deployment works for all domains.

**Q: Can I add domains without redeploying?**
A: No, changing the env var requires redeployment. But you only redeploy once with all domains!

**Q: What if someone accesses from an unauthorized domain?**
A: It logs a warning but still works. Useful for staging/testing.

**Q: Do old links break if I add new domains?**
A: No! Old links continue working because short codes are domain-agnostic.

**Q: Can I have different databases per domain?**
A: No, this setup uses one shared Supabase database. For separate databases, set up separate deployments.

---

## Summary

Multi-domain configuration in Uplink:

1. ✅ **One deployment** → multiple domains
2. ✅ **Auto-detection** → no code changes
3. ✅ **Seamless experience** → works across domains
4. ✅ **Easy setup** → just update env var
5. ✅ **Flexible** → add/remove domains anytime

**Start:** Update `NEXT_PUBLIC_SHORT_URL_DOMAINS` in your environment variables and redeploy!
