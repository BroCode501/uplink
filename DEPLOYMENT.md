# Uplink - Deployment Instructions

## Pre-Deployment Checklist

✅ Application built and tested locally
✅ All features working
✅ Environment variables configured
✅ Database schema ready
✅ Production build passes

## Phase 1: Prepare for Deployment (5 minutes)

### 1. Verify Production Build

```bash
cd /home/arnav/Code/uplink
npm run build
npm run start
```

Visit http://localhost:3000 to verify production build works.

## Phase 2: Create Supabase Project (5 minutes)

### 1. Go to Supabase
- Visit https://supabase.com
- Sign in or create account
- Click **New Project**
- Fill in project details:
  - **Name**: uplink
  - **Database Password**: Choose a strong password
  - **Region**: Choose closest to you (e.g., us-east-1)

### 2. Wait for Project Initialization
- Takes 3-5 minutes
- You'll see a "Your project is being set up" message
- When complete, you'll see the dashboard

### 3. Run Database Schema

In Supabase dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy entire contents of `/home/arnav/Code/uplink/sql-schema.sql`
4. Paste into editor
5. Click **Run** button
6. Verify success (no errors)

### 4. Get Your Credentials

1. Go to **Settings** → **API** (left sidebar)
2. Look for "Project URL" and "anon public"
3. Copy both values

### 5. Enable Email Auth

1. Go to **Authentication** → **Providers** (left sidebar)
2. Find "Email" and make sure it's toggled ON
3. Go to **Auth Policies**
4. Make sure "Allow signup" is enabled

## Phase 3: Setup GitHub Repository (5 minutes)

### 1. Initialize Git

```bash
cd /home/arnav/Code/uplink

# If git not already initialized
git init
git config user.name "Your Name"
git config user.email "your@email.com"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `uplink`
3. Description: `URL Shortener with Supabase and Next.js`
4. Make it **Public** (for free deployment)
5. Click **Create repository**

### 3. Push Code to GitHub

```bash
cd /home/arnav/Code/uplink

git add .
git commit -m "Initial commit: Uplink URL Shortener

- Next.js 15 app router
- Supabase authentication
- URL shortening with analytics
- Responsive UI with shadcn/ui
- Production-ready"

git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/uplink.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Phase 4: Deploy to Vercel (10 minutes)

### 1. Connect Vercel to GitHub

1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Authorize Vercel to access your GitHub
4. You'll see "Import Project" page

### 2. Import Your Repository

1. In the search box, find `uplink`
2. Click **Import**
3. You'll see project configuration

### 3. Configure Environment Variables

In Vercel, under "Environment Variables":

Add these variables (get values from Supabase API settings):

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
NEXT_PUBLIC_SHORT_URL_BASE = https://uplink.vercel.app
```

Note: The `NEXT_PUBLIC_SHORT_URL_BASE` can be your Vercel domain initially.

### 4. Deploy

1. Click **Deploy** button
2. Vercel will build and deploy your app
3. Takes 1-3 minutes
4. You'll see "Deployment complete" when done

### 5. Get Your Vercel URL

Your app will be available at:
```
https://uplink.vercel.app
```

(The actual domain might be different - Vercel will show you)

## Phase 5: Add Custom Domains (Optional)

### For uplink.neopanda.tech:

1. In Vercel dashboard, go to project **Settings** → **Domains**
2. Click **Add Domain**
3. Enter `uplink.neopanda.tech`
4. Vercel will show DNS records to add
5. Go to your domain registrar (neopanda.tech)
6. Add the DNS records Vercel shows
7. Wait 24-48 hours for DNS propagation
8. Vercel will confirm domain is connected

### For meetra.live:

1. Repeat the same process with `meetra.live`
2. Get DNS records from Vercel
3. Add to meetra.live domain registrar

### Update Vercel Environment Variables:

Once domains are working, update in Vercel:

```
NEXT_PUBLIC_SHORT_URL_BASE = https://uplink.neopanda.tech
NEXT_PUBLIC_SHORT_URL_DOMAINS = uplink.neopanda.tech,meetra.live,uplink.vercel.app
```

Then trigger a new deployment by pushing a commit.

## Phase 6: Test Production Deployment

### 1. Test Main Features

Visit your deployed app:
- https://uplink.vercel.app (or your custom domain)

### 2. Create Account

1. Click "Sign up"
2. Enter email and password
3. Click "Sign Up"
4. You should be redirected to dashboard

### 3. Create Short URL

1. On dashboard, fill in long URL
2. Click "Create Short Link"
3. You should see the shortened URL

### 4. Test Redirect

1. Copy the shortened URL
2. Open in new tab
3. Should redirect to original URL
4. Check analytics - click count should be 1

### 5. Test Analytics

1. Go back to dashboard
2. Click "Analytics" on your link
3. Should see 1 click recorded

## Troubleshooting

### "Unauthorized" on Vercel
- Check environment variables are set in Vercel
- They should show green checkmark
- Redeploy after adding variables

### Links not creating
- Check Supabase project is active
- Verify database schema was created
- Check SQL Editor in Supabase for errors

### Custom domain not resolving
- DNS propagation takes 24-48 hours
- Check DNS records are correctly added
- Test with `nslookup uplink.neopanda.tech`

### Analytics not showing clicks
- Verify `url_clicks` table exists in Supabase
- Check browser console for errors
- Make sure you're clicking the short URL

## After Deployment

### 1. Monitor Your App

Check Vercel Analytics:
- Deployments tab - see all deploys
- Monitoring tab - see errors and performance

### 2. Update Code

To update your app:
```bash
cd /home/arnav/Code/uplink
# Make changes
git add .
git commit -m "Update: description"
git push
```

Vercel will automatically redeploy!

### 3. View Logs

In Vercel dashboard → Functions → Logs to see API errors

## Manual Deployment Commands

If you want to deploy from command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## What's Live Now

✅ Landing page with feature overview
✅ Sign up and sign in
✅ Dashboard with link management
✅ Link creation with custom slugs
✅ Analytics page with click tracking
✅ Public redirects working
✅ Responsive design on all devices

## Next Steps

1. **Share with Others**
   - Your app is now publicly accessible
   - Share the URL with friends
   - They can create accounts and shorten URLs

2. **Monitor Usage**
   - Check Vercel analytics
   - Monitor Supabase database
   - Check for errors in logs

3. **Optional Enhancements**
   - Add QR codes
   - Add geolocation analytics
   - Add social sharing
   - Add URL expiration scheduling

## Support

If you encounter issues:

1. **Check Vercel logs**: Vercel dashboard → Functions
2. **Check Supabase logs**: Supabase dashboard → Logs
3. **Check browser console**: F12 → Console tab
4. **Read error messages carefully**

## Success Criteria

You'll know it's working when:

✅ You can sign up and create an account
✅ You can create a shortened URL
✅ The short URL redirects to the original
✅ Analytics shows the click
✅ You can see your link on the dashboard
✅ You can delete a link

---

**Congratulations! Your URL Shortener is now live! 🎉**

Share your custom domains with others and start shortening URLs!
