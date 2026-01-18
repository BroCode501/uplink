# Uplink Simple API v1

Dead simple API for creating shortened URLs. No authentication required. Perfect for integrating Uplink into other applications.

## Quick Start

### Create a Shortened URL

```bash
curl -X POST https://meetra.live/api/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very/long/url"
  }'
```

### Response (201 Created)

```json
{
  "success": true,
  "shortUrl": "https://meetra.live/abc123",
  "code": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "permanent": false,
  "expiresAt": "2025-01-26T19:22:05.000Z"
}
```

---

## API Endpoint

### `POST /api/v1/shorten`

Create a shortened URL instantly.

**Request Body:**

```json
{
  "url": "https://example.com/very/long/url",  // required
  "slug": "my-custom-slug",                      // optional
  "permanent": true                              // optional, default: false
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `url` | string | **Yes** | Must start with `http://` or `https://` |
| `slug` | string | No | 2-50 alphanumeric, hyphens, underscores. Must be unique. |
| `permanent` | boolean | No | If `true`, link never expires. If `false`, expires in 30 days. Default: `false` |

**Response (201 Created):**

```json
{
  "success": true,
  "shortUrl": "https://meetra.live/abc123",
  "code": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "permanent": false,
  "expiresAt": "2025-01-26T19:22:05.000Z"
}
```

---

## Error Responses

### 400 Bad Request

Missing or invalid required field.

```json
{
  "success": false,
  "error": "Invalid URL format. Must start with http:// or https://"
}
```

### 409 Conflict

Custom slug is already taken.

```json
{
  "success": false,
  "error": "This slug is already taken. Try a different one."
}
```

### 500 Internal Server Error

Server-side error occurred.

```json
{
  "success": false,
  "error": "Internal server error. Please try again later."
}
```

---

## Examples

### JavaScript / Node.js

```javascript
const response = await fetch('https://meetra.live/api/v1/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com/very/long/url',
  }),
});

const data = await response.json();
console.log(data.shortUrl); // https://meetra.live/abc123
```

### Python

```python
import requests

response = requests.post('https://meetra.live/api/v1/shorten', json={
    'url': 'https://example.com/very/long/url'
})

data = response.json()
print(data['shortUrl'])  # https://meetra.live/abc123
```

### PHP

```php
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://meetra.live/api/v1/shorten',
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode([
    'url' => 'https://example.com/very/long/url'
  ]),
  CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
));

$response = curl_exec($curl);
$data = json_decode($response, true);
echo $data['shortUrl']; // https://meetra.live/abc123

curl_close($curl);
```

### Go

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

func main() {
	payload := map[string]interface{}{
		"url": "https://example.com/very/long/url",
	}

	body, _ := json.Marshal(payload)
	resp, _ := http.Post(
		"https://meetra.live/api/v1/shorten",
		"application/json",
		bytes.NewBuffer(body),
	)

	respBody, _ := io.ReadAll(resp.Body)
	var data map[string]interface{}
	json.Unmarshal(respBody, &data)
	
	fmt.Println(data["shortUrl"]) // https://meetra.live/abc123
}
```

### cURL

```bash
# Basic usage
curl -X POST https://meetra.live/api/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/very/long/url"}'

# With custom slug
curl -X POST https://meetra.live/api/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://example.com/very/long/url",
    "slug":"my-link"
  }'

# Permanent link
curl -X POST https://meetra.live/api/v1/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://example.com/very/long/url",
    "permanent":true
  }'
```

---

## Use Cases

### 1. Social Media Automation
Shorten URLs before posting to Twitter, LinkedIn, etc.

```javascript
const shortUrl = await shortenUrl('https://your-blog.com/article');
tweet(`Check this out: ${shortUrl}`);
```

### 2. Analytics Integration
Create shortened links with custom slugs for campaigns.

```javascript
await shortenUrl('https://store.com/summer-sale', {
  slug: 'summer-2025',
  permanent: true
});
// Link: https://meetra.live/summer-2025
```

### 3. Email Campaigns
Generate short links for email templates.

```javascript
links = await Promise.all(
  urls.map(url => shortenUrl(url))
);
// Send links in email template
```

### 4. QR Code Generation
Combine with QR code library for printable codes.

```javascript
const { shortUrl } = await shortenUrl('https://event.com/register');
generateQRCode(shortUrl); // Smaller QR code!
```

### 5. Mobile App Integration
Quick integration for mobile apps needing URL shortening.

```swift
let params = [
    "url": "https://example.com/share/product/123"
]
// POST to /api/v1/shorten
```

---

## Features

✅ **No Authentication Required** - Works out of the box  
✅ **Custom Slugs** - Use your own short codes  
✅ **Permanent Links** - Links that never expire  
✅ **Auto-Generated Codes** - Get unique codes automatically  
✅ **Simple Response** - Easy-to-parse JSON  
✅ **Fast** - Creates links instantly  
✅ **Reliable** - Powered by Supabase PostgreSQL  
✅ **Multi-Domain** - Works across all Uplink domains  

---

## Rate Limiting

**Current Limit:** 30 requests per minute per IP address

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 30
X-RateLimit-Remaining: 29
X-RateLimit-Reset: 1705701125
```

When you exceed the limit, you'll receive a `429 Too Many Requests` response:

```json
{
  "success": false,
  "error": "Rate limit exceeded. Max 30 requests per minute."
}
```

**What counts toward the limit?**
- Only `POST /api/v1/shorten` requests count
- GET requests to the documentation do not count
- Failed requests (400, 409 errors) still count toward the limit

**Tips:**
- Implement exponential backoff in your client
- Check `X-RateLimit-Remaining` header before making requests
- Use `X-RateLimit-Reset` to know when your limit resets
- For bulk operations, consider spacing requests over time

If you need higher limits for legitimate use, contact the BroCode Tech Community.

---

## FAQ

**Q: Can I track clicks on my links?**  
A: Not through the simple API. Use the authenticated Uplink dashboard for analytics.

**Q: How long do temporary links last?**  
A: 30 days by default. Set `permanent: true` for links that never expire.

**Q: Can I delete links?**  
A: Not through the simple API. Use the authenticated dashboard to manage links.

**Q: Can I use this with other Uplink domains?**  
A: Yes! The API works from any configured domain:
- `https://meetra.live/api/v1/shorten`
- `https://uplink.neopanda.tech/api/v1/shorten`
- `https://uplink-brocode.vercel.app/api/v1/shorten`

All are identical.

**Q: How many links can I create?**  
A: Unlimited (with reasonable use). No authentication means we can't track per-user quotas.

**Q: Is this secure?**  
A: Yes, but the API is public. Don't use it for sensitive URLs. Each short code is generated randomly (8 characters), making them impossible to guess.

---

## Open Source

Uplink is free and open source software by the BroCode Tech Community.

- **GitHub:** https://github.com/BroCode501/uplink
- **License:** MIT
- **Report Issues:** https://github.com/BroCode501/uplink/issues

---

## Support

Questions? Issues? Feature requests?

- **GitHub Issues:** https://github.com/BroCode501/uplink/issues
- **Community:** https://brocode-tech.netlify.app/

---

## Changelog

### v1.0.0 (2025-01-19)
- Initial release
- POST /api/v1/shorten endpoint
- Support for custom slugs
- Support for permanent links
