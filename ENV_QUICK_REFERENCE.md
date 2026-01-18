# Environment Variables - Quick Reference Card

## 3 Required Variables for Vercel

### 1️⃣ NEXT_PUBLIC_SUPABASE_URL
```
https://nmpnefwcziwjkibquvey.supabase.co
```
- Get from: Supabase > Settings > API > Project URL
- Same for all environments

### 2️⃣ NEXT_PUBLIC_SUPABASE_ANON_KEY
```
sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
```
- Get from: Supabase > Settings > API > Anon Public Key
- Same for all environments

### 3️⃣ NEXT_PUBLIC_SHORT_URL_BASE
**Choose ONE domain:**

| Domain | Use Case |
|--------|----------|
| `https://meetra.live` | 🎯 **PRIMARY** (Production) |
| `https://uplink.neopanda.tech` | Alternative domain |
| `https://uplink-brocode.vercel.app` | Development/Testing |

---

## Copy-Paste for Vercel

```env
NEXT_PUBLIC_SUPABASE_URL=https://nmpnefwcziwjkibquvey.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_KMMYBgDp_71D7zcykdoHlg_c0PERWt5
NEXT_PUBLIC_SHORT_URL_BASE=https://meetra.live
```

---

## Key Points

✅ **All 3 are PUBLIC** (safe to expose in frontend code)  
✅ **Must be HTTPS** (no http://)  
✅ **NO trailing slashes** on domain  
✅ **Supabase vars stay the same** across all deployments  
✅ **SHORT_URL_BASE changes** by domain if needed  

---

## Vercel Setup Steps

1. Go to Vercel project Settings
2. Click "Environment Variables" 
3. Add 3 variables above
4. Set scope to: Production, Preview, Development
5. Click Save
6. Redeploy

---

## Test After Deploy

✅ Can sign up / login  
✅ Can create short links  
✅ Short links redirect correctly  
✅ Dashboard shows statistics  
✅ Works on all 3 domains  

---

## Common Mistakes ❌

- ❌ Trailing slash: `https://meetra.live/`
- ❌ Missing quotes in Anon Key
- ❌ Wrong domain name in SHORT_URL_BASE
- ❌ HTTP instead of HTTPS
- ❌ Forgot to set all 3 environments (prod/preview/dev)

---

## If Something Breaks

| Issue | Fix |
|-------|-----|
| 404 on shortened links | Check SHORT_URL_BASE matches domain |
| Supabase error | Verify URL and Anon Key are correct |
| Links work locally but not on Vercel | SHORT_URL_BASE might be wrong |
| All 3 domains not working | Add all 3 domains in Vercel Settings → Domains |

---

**For detailed guide:** See `VERCEL_DEPLOYMENT.md`
