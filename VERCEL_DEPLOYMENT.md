# Vercel Deployment Guide - Environment Variables

## Overview
This guide covers the environment variables needed to deploy Uplink to Vercel with your 3 configured domains:
- **meetra.live**
- **uplink.neopanda.tech**
- **uplink-brocode.vercel.app** (default Vercel domain)

---

## Required Environment Variables

### 1. **NEXT_PUBLIC_SUPABASE_URL**
**Type:** Public (Frontend & Backend)  
**Source:** Your Supabase project dashboard  
**Location:** Supabase > Project Settings > API > Project URL

**Example:**
```
https://nmpnefwcziwjkibquvey.supabase.co
```

**Steps to get it:**
1. Go to [supabase.com](https://supabase.com)
2. Open your Uplink project
3. Click "Settings" → "API"
4. Copy the "Project URL" value

---

### 2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
**Type:** Public (Frontend & Backend)  
**Source:** Your Supabase project dashboard  
**Location:** Supabase > Project Settings > API > Anon Public Key

**Example:**
```
sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
```

**Steps to get it:**
1. Go to [supabase.com](https://supabase.com)
2. Open your Uplink project
3. Click "Settings" → "API"
4. Copy the "Anon Public" key (starts with `sb_publishable_`)

---

### 3. **NEXT_PUBLIC_SHORT_URL_BASE**
**Type:** Public (Frontend & Backend)  
**Purpose:** Base URL for shortened links redirect  
**Important:** Must match your redirect domain exactly

**For Each Domain:**

#### Option A: meetra.live (Recommended for production)
```
https://meetra.live
```

#### Option B: uplink.neopanda.tech (Alternative)
```
https://uplink.neopanda.tech
```

#### Option C: uplink-brocode.vercel.app (Default/Testing)
```
https://uplink-brocode.vercel.app
```

**How it's used:**
- User creates short link → stored in database
- Shortened URL format: `{NEXT_PUBLIC_SHORT_URL_BASE}/{short_code}`
- Example: `https://meetra.live/abc123def`

**⚠️ Important Notes:**
- Must be HTTPS (no http://)
- Must NOT have trailing slash: ❌ `https://meetra.live/` ✅ `https://meetra.live`
- If you change this value, previously shortened links may break
- Should be the primary/main domain users will use

---

## Vercel Environment Variables Setup

### Step-by-Step Deployment:

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Select your GitHub repository: `BroCode501/uplink`
   - Choose framework: **Next.js**

2. **Configure Environment Variables:**
   - In Vercel project settings → "Environment Variables"
   - Add these three variables:

   | Variable | Value | Scope |
   |----------|-------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://nmpnefwcziwjkibquvey.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5` | Production, Preview, Development |
   | `NEXT_PUBLIC_SHORT_URL_BASE` | `https://meetra.live` | Production, Preview, Development |

3. **Add Custom Domains:**
   - Go to Vercel project → "Settings" → "Domains"
   - Add each domain:
     - `meetra.live`
     - `uplink.neopanda.tech`
   - Point DNS records to Vercel nameservers or CNAME

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Test on all three domains

---

## Environment Variables Checklist

### Required (Must Have)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - From Supabase
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase
- ✅ `NEXT_PUBLIC_SHORT_URL_BASE` - Your primary domain

### Optional (Auto-configured)
- ℹ️ `NODE_ENV` - Automatically set by Vercel (production/preview/development)
- ℹ️ `VERCEL` - Set to "1" by Vercel automatically
- ℹ️ `VERCEL_ENV` - Set by Vercel automatically

---

## Common Deployment Issues & Solutions

### Issue 1: Shortened Links Not Working
**Problem:** Links work on localhost but not on Vercel  
**Cause:** `NEXT_PUBLIC_SHORT_URL_BASE` doesn't match your domain  
**Solution:** 
1. Check Vercel deployment domain
2. Update `NEXT_PUBLIC_SHORT_URL_BASE` to match
3. Redeploy

### Issue 2: Supabase Connection Error
**Problem:** "Failed to initialize Supabase client"  
**Cause:** Wrong or missing Supabase credentials  
**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct (no trailing slash)
2. Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` starts with `sb_publishable_`
3. Check Supabase project is active
4. Redeploy

### Issue 3: Database Tables Don't Exist
**Problem:** 404 when creating links or viewing dashboard  
**Cause:** SQL schema not run in Supabase  
**Solution:**
1. Open Supabase → SQL Editor
2. Create new query
3. Copy entire contents of `sql-schema.sql`
4. Paste and execute
5. Check tables created: `short_urls`, `url_clicks`

### Issue 4: CORS or Domain Issues
**Problem:** Requests blocked from certain domains  
**Solution:**
1. All domains point to same Vercel project (no CORS needed)
2. Supabase automatically allows requests from Vercel

---

## Environment Variables by Domain Strategy

### Strategy 1: Single Domain (Recommended)
Use `NEXT_PUBLIC_SHORT_URL_BASE = https://meetra.live`
- One short URL format across all services
- Simpler analytics and tracking
- Professional appearance

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmpnefwcziwjkibquvey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
NEXT_PUBLIC_SHORT_URL_BASE=https://meetra.live
```

### Strategy 2: Separate Deployments (Advanced)
Different Vercel projects for each domain with different `NEXT_PUBLIC_SHORT_URL_BASE`

```
Project 1 (meetra.live):
NEXT_PUBLIC_SHORT_URL_BASE=https://meetra.live

Project 2 (uplink.neopanda.tech):
NEXT_PUBLIC_SHORT_URL_BASE=https://uplink.neopanda.tech

Project 3 (uplink-brocode.vercel.app):
NEXT_PUBLIC_SHORT_URL_BASE=https://uplink-brocode.vercel.app
```

**⚠️ Note:** This shares the same Supabase database, so shortened links work across all domains.

---

## Vercel Environment Variables UI Guide

1. Go to your Vercel project
2. Click "Settings" in top menu
3. Select "Environment Variables" from sidebar
4. Click "Add New" button
5. Fill in:
   - **Name:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://nmpnefwcziwjkibquvey.supabase.co`
   - **Environments:** Check all (Production, Preview, Development)
6. Repeat for other two variables
7. Click "Save"
8. Redeploy for changes to take effect

---

## Redeployment After Environment Variable Changes

After updating environment variables:

1. Go to Vercel project → "Deployments"
2. Find latest deployment
3. Click three dots → "Redeploy"
4. OR push new commit to trigger automatic redeploy
5. Wait for build to complete
6. Test at each domain

---

## Local Development (.env.local) Reference

Keep your local `.env.local` file synchronized:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmpnefwcziwjkibquvey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
NEXT_PUBLIC_SHORT_URL_BASE=http://localhost:3000
```

---

## Summary

| Variable | Local Dev | Vercel |
|----------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://nmpnefwcziwjkibquvey.supabase.co` | `https://nmpnefwcziwjkibquvey.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5` | `sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5` |
| `NEXT_PUBLIC_SHORT_URL_BASE` | `http://localhost:3000` | `https://meetra.live` (or your chosen domain) |

---

## Next Steps

1. ✅ Ensure Supabase database is created and schema is loaded
2. ✅ Get Supabase URL and Anon Key
3. ✅ Connect GitHub repo to Vercel
4. ✅ Set environment variables in Vercel
5. ✅ Add custom domains in Vercel
6. ✅ Deploy
7. ✅ Test shortened links on each domain
8. ✅ Test authentication and dashboard
9. ✅ Monitor Vercel analytics

---

**Need Help?**
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Next.js: https://nextjs.org/docs
