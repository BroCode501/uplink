# Uplink Simple API v1

Dead simple API for creating shortened URLs. **Token authentication required.**

> **Note:** Replace `your-domain.com` in all examples below with your configured Uplink domain. Examples use `meetra.live` as a placeholder.

## Authentication

The API requires token-based authentication. Each request must include an `Authorization` header with your API token.

### Getting an API Token

1. Log in to your Uplink dashboard
2. Go to "API Tokens" section
3. Click "Generate New Token"
4. Give it a name and optional description
5. Choose expiration (7 days, 30 days, 90 days, 1 year, or never)
6. **Copy the token immediately** - you won't be able to see it again!

Token format: `uplink_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (50+ characters)

### Using Your Token

Include the token in the `Authorization` header of every request:

```
Authorization: Bearer uplink_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Quick Start

### Create a Shortened URL

```bash
curl -X POST https://your-domain.com/api/v1/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer uplink_your_token_here" \
  -d '{
    "url": "https://example.com/very/long/url"
  }'
```

### Response (201 Created)

```json
{
  "success": true,
  "shortUrl": "https://your-domain.com/abc123",
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
  "shortUrl": "https://your-domain.com/abc123",
  "code": "abc123",
  "originalUrl": "https://example.com/very/long/url",
  "permanent": false,
  "expiresAt": "2025-01-26T19:22:05.000Z"
}
```

---

## Error Responses

### 401 Unauthorized

Missing, invalid, or expired API token.

```json
{
  "success": false,
  "error": "Missing Authorization header. Use: Authorization: Bearer uplink_xxx"
}
```

```json
{
  "success": false,
  "error": "Invalid API token"
}
```

```json
{
  "success": false,
  "error": "API token has expired"
}
```

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
const token = 'uplink_your_token_here';
const response = await fetch('https://your-domain.com/api/v1/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    url: 'https://example.com/very/long/url',
  }),
});

const data = await response.json();

if (data.success) {
  console.log('Short URL:', data.shortUrl);
} else {
  console.error('Error:', data.error);
}
```

### Python

```python
import requests

token = 'uplink_your_token_here'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}',
}

response = requests.post(
    'https://your-domain.com/api/v1/shorten',
    json={'url': 'https://example.com/very/long/url'},
    headers=headers
)

data = response.json()

if data['success']:
    print(f"Short URL: {data['shortUrl']}")
else:
    print(f"Error: {data['error']}")
```

### PHP

```php
<?php
$token = 'uplink_your_token_here';
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://your-domain.com/api/v1/shorten',
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode([
    'url' => 'https://example.com/very/long/url'
  ]),
  CURLOPT_HTTPHEADER => array(
    'Content-Type: application/json',
    "Authorization: Bearer $token"
  ),
  CURLOPT_RETURNTRANSFER => true,
));

$response = curl_exec($curl);
$data = json_decode($response, true);

if ($data['success']) {
    echo "Short URL: " . $data['shortUrl'] . PHP_EOL;
} else {
    echo "Error: " . $data['error'] . PHP_EOL;
}

curl_close($curl);
?>
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
	token := "uplink_your_token_here"
	
	payload := map[string]interface{}{
		"url": "https://example.com/very/long/url",
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(
		"POST",
		"https://your-domain.com/api/v1/shorten",
		bytes.NewBuffer(body),
	)
	
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", token))

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var data map[string]interface{}
	json.Unmarshal(respBody, &data)

	if data["success"].(bool) {
		fmt.Println("Short URL:", data["shortUrl"])
	} else {
		fmt.Println("Error:", data["error"])
	}
}
```

### cURL

```bash
TOKEN="uplink_your_token_here"

# Basic usage
curl -X POST https://your-domain.com/api/v1/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"url":"https://example.com/very/long/url"}'

# With custom slug
curl -X POST https://your-domain.com/api/v1/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url":"https://example.com/very/long/url",
    "slug":"my-link"
  }'

# Permanent link
curl -X POST https://your-domain.com/api/v1/shorten \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
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
// Link: https://your-domain.com/summer-2025
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

**Q: Do I need authentication?**  
A: Yes! You need an API token to use the public API. Generate one in your dashboard under "API Tokens" section.

**Q: Where do I get my API token?**  
A: Log in to your Uplink dashboard, go to "API Tokens", and click "Generate New Token". Copy it immediately - you won't be able to see it again!

**Q: How long do my tokens last?**  
A: As long as you set them to. When generating a token, choose: 7 days, 30 days, 90 days, 1 year, or never expires.

**Q: What if I lose my token?**  
A: You can't recover it. Delete the token in your dashboard and generate a new one.

**Q: Can I rotate my tokens?**  
A: Yes! Generate a new token, update your apps to use it, then delete the old token.

**Q: Can I track clicks on my links?**  
A: Yes! Use the Uplink dashboard to see analytics for all your links (both API and dashboard created).

**Q: How long do temporary links last?**  
A: 30 days by default. Set `permanent: true` for links that never expire.

**Q: Can I delete links via the API?**  
A: Use the authenticated dashboard to manage and delete links.

**Q: Can I use this with other Uplink domains?**  
A: Yes! The API works from any configured domain. All configured domains are identical and use the same database. Links created on one domain work on all domains.

**Q: How many links can I create?**  
A: Unlimited (with reasonable use). Rate limit is 30 requests per minute per IP.

**Q: Is this secure?**  
A: Yes! We use SHA-256 hashing for token storage and timing-safe comparison for verification. Your API token is as powerful as your password, so treat it like one.

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
