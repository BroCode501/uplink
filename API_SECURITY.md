# API Security & Rate Limiting Guide

This document explains the security measures in place for the Uplink API and how to handle rate limiting.

## Rate Limiting

### Current Configuration

- **Limit:** 30 requests per minute
- **Per:** IP address
- **Scope:** POST /api/v1/shorten only
- **Storage:** In-memory (per-instance)

### Rate Limit Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 30          # Maximum requests per minute
X-RateLimit-Remaining: 29      # Requests remaining in current window
X-RateLimit-Reset: 1705701125  # Unix timestamp when limit resets
```

### Rate Limit Response (429)

When you exceed the limit:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Max 30 requests per minute."
}
```

### HTTP Status Codes

- **201** - Link created successfully
- **400** - Bad request (invalid URL, missing fields, etc.)
- **409** - Conflict (slug already taken)
- **429** - Too many requests (rate limit exceeded)
- **500** - Server error

## Handling Rate Limiting in Your Code

### JavaScript / Node.js

```javascript
async function createShortUrl(url, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch('https://meetra.live/api/v1/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      // Check rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');
      
      console.log(`Requests remaining: ${remaining}`);
      
      if (response.status === 429) {
        const resetDate = new Date(parseInt(reset) * 1000);
        const waitTime = resetDate - new Date();
        console.log(`Rate limited. Retrying in ${waitTime}ms...`);
        await new Promise(r => setTimeout(r, waitTime + 100));
        attempt++;
        continue;
      }

      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

### Python

```python
import requests
import time
from datetime import datetime

def create_short_url(url, max_retries=3):
    attempt = 0
    
    while attempt < max_retries:
        response = requests.post(
            'https://meetra.live/api/v1/shorten',
            json={'url': url}
        )
        
        # Check rate limit headers
        remaining = response.headers.get('X-RateLimit-Remaining')
        reset = response.headers.get('X-RateLimit-Reset')
        
        print(f"Requests remaining: {remaining}")
        
        if response.status_code == 429:
            reset_time = int(reset)
            wait_time = reset_time - int(time.time())
            print(f"Rate limited. Retrying in {wait_time} seconds...")
            time.sleep(wait_time + 1)
            attempt += 1
            continue
        
        return response.json()
    
    raise Exception('Max retries exceeded')
```

### Best Practices

1. **Check Remaining Requests**
   ```javascript
   const remaining = parseInt(response.headers.get('X-RateLimit-Remaining'));
   if (remaining < 5) {
     console.warn('Approaching rate limit!');
   }
   ```

2. **Implement Backoff Strategy**
   ```javascript
   const wait = (ms) => new Promise(r => setTimeout(r, ms));
   
   // Exponential backoff
   let delay = 1000;
   while (attempt < maxRetries) {
     // ... make request
     if (rateLimited) {
       await wait(delay);
       delay *= 2; // Exponential backoff
     }
   }
   ```

3. **Batch Operations**
   ```javascript
   // Don't do this (30+ requests at once)
   const urls = [...]; // 50 URLs
   await Promise.all(urls.map(u => shorten(u)));
   
   // Do this instead (space out requests)
   const urls = [...]; // 50 URLs
   for (const url of urls) {
     const result = await shorten(url);
     await wait(2000); // Space requests by 2 seconds
   }
   ```

4. **Monitor Rate Limit Status**
   ```javascript
   const checkStatus = (response) => {
     const limit = response.headers.get('X-RateLimit-Limit');
     const remaining = response.headers.get('X-RateLimit-Remaining');
     const reset = response.headers.get('X-RateLimit-Reset');
     
     const percentage = (remaining / limit) * 100;
     
     if (percentage < 10) {
       console.warn(`⚠️ Rate limit: ${remaining}/${limit} remaining`);
     }
   };
   ```

## IP-Based Limiting

Rate limits are applied per **IP address**, not per user.

- **Shared networks** (corporate networks, schools): All users on the network share the same limit
- **Residential proxies**: Each request from a different IP has its own limit
- **VPN users**: Your VPN provider's exit IP is used for rate limiting

If you need higher limits or are behind a NAT/proxy, contact the BroCode Tech Community.

## Storage Considerations

Rate limiting is stored **in-memory per instance**:

- ✅ Works great for single-instance deployments
- ⚠️ For multi-instance deployments (load-balanced), each instance has separate limits
- 🔄 Limits are reset on server restart

For production with multiple instances, consider:
- Redis-based rate limiting
- Cloudflare rate limiting (at the edge)
- API gateway rate limiting

## Security Notes

### What the API Does NOT Have

- ❌ No API key requirement (intentionally public)
- ❌ No CORS restrictions (open to all origins)
- ❌ No request signing/authentication
- ❌ No IP whitelisting

### What the API DOES Have

- ✅ Rate limiting (prevent abuse)
- ✅ Input validation (prevent malicious URLs)
- ✅ HTTPS only (data in transit)
- ✅ Supabase security (data at rest)

### Security Recommendations

1. **Don't put sensitive data in URLs**
   ```javascript
   // Bad - password in URL
   shorten('https://api.example.com?token=secret123&user=admin');
   
   // Good - use headers/body
   shorten('https://api.example.com/secure-endpoint');
   ```

2. **Validate URLs on the server**
   ```javascript
   // Don't blindly trust shortened links
   const isInternalUrl = new URL(url).origin === 'https://api.example.com';
   if (!isInternalUrl) {
     // Warn user or use special handling
   }
   ```

3. **Monitor your usage**
   - Track which URLs you're shortening
   - Monitor for abuse of your shortened links
   - Delete temporary links you don't need

4. **Use HTTPS**
   - Always use HTTPS when making requests
   - Never send URLs or user data over HTTP

## Future Improvements

We're considering:

- [ ] Redis-based distributed rate limiting
- [ ] API keys for custom rate limits
- [ ] Analytics dashboard for API usage
- [ ] Webhook notifications for events
- [ ] Bulk API endpoint
- [ ] Link deletion via API
- [ ] Custom expiration via API
- [ ] QR code generation via API

## Support

Questions or issues?

- **GitHub Issues:** https://github.com/BroCode501/uplink/issues
- **Community:** https://brocode-tech.netlify.app/
- **Documentation:** https://meetra.live/docs

## Changelog

### v1.0.0 (2025-01-19)
- Initial release
- Rate limiting: 30 requests per minute
- In-memory storage
