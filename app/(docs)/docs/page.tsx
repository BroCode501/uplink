'use client';

import Navigation from '@/components/Navigation';
import { CodeBlock, Collapsible, RequestBodyTable, StatusCode } from '@/components/docs/CodeBlock';
import { ExternalLink, Zap, Code, Lightbulb } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border-b border-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">API Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              Simple, powerful API for integrating URL shortening into your applications.
              Token-based authentication for secure API access.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded text-sm font-semibold transition-colors"
              >
                OpenAPI JSON
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://swagger.io/tools/swagger-ui/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-amber-700 dark:border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded text-sm font-semibold transition-colors"
              >
                View in Swagger UI
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Authentication */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h2 className="text-3xl font-bold">Authentication</h2>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="font-bold mb-4">Getting Your API Token</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                <li>Sign in to your Uplink dashboard</li>
                <li>Go to the "API Tokens" section</li>
                <li>Click "Generate New Token"</li>
                <li>Choose token expiration (7 days, 30 days, 90 days, 1 year, or never)</li>
                <li>Copy your token immediately - you won't see it again!</li>
              </ol>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="font-bold mb-4">Using Your Token</h3>
              <p className="text-muted-foreground mb-4">Include the token in the Authorization header of every request:</p>
              <CodeBlock
                language="bash"
                code={`Authorization: Bearer uplink_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔐 Security Tip
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Your API token is as powerful as your password. Keep it secret and never commit it to version control. If compromised, generate a new token immediately.
              </p>
            </div>
          </section>

          {/* Quick Start */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h2 className="text-3xl font-bold">Quick Start</h2>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <p className="text-muted-foreground mb-4">
                Create a shortened URL in seconds with a single POST request using your API token:
              </p>
              <CodeBlock
                language="bash"
                code={`TOKEN="uplink_yse2JpXPSUKu-szJel4waiBsU6XNO0FsOgFLx8qkuwU"

curl -X POST https://meetra.live/api/v1/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{
    "url": "https://example.com/very/long/url"
  }'`}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Tip: Try it now!
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Replace the TOKEN value with your actual API token, then copy the curl command and run it in your terminal to create your first shortened URL.
              </p>
            </div>
          </section>

          {/* Endpoint Reference */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h2 className="text-3xl font-bold">Endpoint Reference</h2>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <div className="font-mono text-lg font-bold mb-2">
                <span className="text-green-700 dark:text-green-400">POST</span>{' '}
                <span className="text-amber-700 dark:text-amber-400">/api/v1/shorten</span>
              </div>
              <p className="text-muted-foreground">Create a shortened URL</p>
            </div>

            {/* Request */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Request</h3>

              <Collapsible title="Request Body" defaultOpen>
                <div className="space-y-4">
                  <RequestBodyTable
                    fields={[
                      {
                        name: 'url',
                        type: 'string',
                        required: true,
                        description:
                          'The URL to shorten. Must start with http:// or https://',
                      },
                      {
                        name: 'slug',
                        type: 'string',
                        required: false,
                        description:
                          'Custom short code. 2-50 alphanumeric, hyphens, or underscores. Must be unique.',
                      },
                      {
                        name: 'permanent',
                        type: 'boolean',
                        required: false,
                        description:
                          'If true, link never expires. If false, expires in 30 days. Default: false',
                      },
                    ]}
                  />
                </div>
              </Collapsible>

              <Collapsible title="Example Request" defaultOpen className="mt-4">
                <CodeBlock
                  language="json"
                  code={JSON.stringify(
                    {
                      url: 'https://example.com/very/long/url',
                      slug: 'my-custom-slug',
                      permanent: true,
                    },
                    null,
                    2
                  )}
                />
              </Collapsible>
            </div>

            {/* Response */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Response</h3>

               <Collapsible title="201 Created - Success" defaultOpen>
                 <CodeBlock
                   language="json"
                   code={JSON.stringify(
                     {
                       success: true,
                       shortUrl: 'https://meetra.live/abc123',
                       code: 'abc123',
                       originalUrl: 'https://example.com/very/long/url',
                       permanent: false,
                       expiresAt: '2025-01-26T19:22:05.000Z',
                     },
                     null,
                     2
                   )}
                 />
               </Collapsible>

               <div className="mt-4 space-y-4">
                 <Collapsible title="401 Unauthorized - Missing or Invalid Token">
                   <CodeBlock
                     language="json"
                     code={JSON.stringify(
                       {
                         success: false,
                         error:
                           'Missing Authorization header. Use: Authorization: Bearer uplink_xxx',
                       },
                       null,
                       2
                     )}
                   />
                 </Collapsible>

                 <Collapsible title="400 Bad Request - Missing or Invalid URL">
                  <CodeBlock
                    language="json"
                    code={JSON.stringify(
                      {
                        success: false,
                        error:
                          'Invalid URL format. Must start with http:// or https://',
                      },
                      null,
                      2
                    )}
                  />
                </Collapsible>

                <Collapsible title="409 Conflict - Slug Already Taken">
                  <CodeBlock
                    language="json"
                    code={JSON.stringify(
                      {
                        success: false,
                        error: 'This slug is already taken. Try a different one.',
                      },
                      null,
                      2
                    )}
                  />
                </Collapsible>

                <Collapsible title="500 Internal Server Error">
                  <CodeBlock
                    language="json"
                    code={JSON.stringify(
                      {
                        success: false,
                        error: 'Internal server error. Please try again later.',
                      },
                      null,
                      2
                    )}
                  />
                </Collapsible>
              </div>
            </div>
          </section>

          {/* Code Examples */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h2 className="text-3xl font-bold">Code Examples</h2>
            </div>

            <div className="space-y-6">
               {/* JavaScript */}
               <Collapsible title="JavaScript / Node.js" defaultOpen>
                 <CodeBlock
                   language="javascript"
                   code={`const token = 'uplink_your_token_here';

const response = await fetch('https://meetra.live/api/v1/shorten', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${token}\`,
  },
  body: JSON.stringify({
    url: 'https://example.com/very/long/url',
    permanent: false,
  }),
});

const data = await response.json();

if (data.success) {
  console.log('Short URL:', data.shortUrl);
  console.log('Code:', data.code);
  console.log('Expires:', data.expiresAt);
} else {
  console.error('Error:', data.error);
}`}
                 />
               </Collapsible>

               {/* Python */}
               <Collapsible title="Python">
                 <CodeBlock
                   language="python"
                   code={`import requests

token = 'uplink_your_token_here'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}',
}

payload = {
    'url': 'https://example.com/very/long/url',
    'permanent': False
}

response = requests.post(
    'https://meetra.live/api/v1/shorten',
    json=payload,
    headers=headers
)

data = response.json()

if data['success']:
    print(f"Short URL: {data['shortUrl']}")
    print(f"Code: {data['code']}")
    print(f"Expires: {data['expiresAt']}")
else:
    print(f"Error: {data['error']}")`}
                 />
               </Collapsible>

               {/* PHP */}
               <Collapsible title="PHP">
                 <CodeBlock
                   language="php"
                   code={`<?php
$token = 'uplink_your_token_here';
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://meetra.live/api/v1/shorten',
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode([
    'url' => 'https://example.com/very/long/url',
    'permanent' => false
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
    echo "Code: " . $data['code'] . PHP_EOL;
} else {
    echo "Error: " . $data['error'] . PHP_EOL;
}

curl_close($curl);
?>`}
                 />
               </Collapsible>

               {/* Go */}
               <Collapsible title="Go">
                 <CodeBlock
                   language="go"
                   code={`package main

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
		"url":       "https://example.com/very/long/url",
		"permanent": false,
	}

	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest(
		"POST",
		"https://meetra.live/api/v1/shorten",
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
		fmt.Println("Code:", data["code"])
	} else {
		fmt.Println("Error:", data["error"])
	}
}`}
                 />
               </Collapsible>

               {/* cURL */}
               <Collapsible title="cURL">
                 <CodeBlock
                   language="bash"
                   code={`TOKEN="uplink_your_token_here"

# Basic usage
curl -X POST https://meetra.live/api/v1/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"url":"https://example.com/very/long/url"}'

# With custom slug
curl -X POST https://meetra.live/api/v1/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{
    "url":"https://example.com/very/long/url",
    "slug":"my-link"
  }'

# Permanent link
curl -X POST https://meetra.live/api/v1/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{
    "url":"https://example.com/very/long/url",
    "permanent":true
  }'`}
                 />
               </Collapsible>

               {/* Swift */}
               <Collapsible title="Swift (iOS/macOS)">
                 <CodeBlock
                   language="swift"
                   code={`import Foundation

let token = "uplink_your_token_here"
let url = URL(string: "https://meetra.live/api/v1/shorten")!
var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.setValue("Bearer \\(token)", forHTTPHeaderField: "Authorization")

let payload: [String: Any] = [
    "url": "https://example.com/very/long/url",
    "permanent": false
]

request.httpBody = try? JSONSerialization.data(
    withJSONObject: payload,
    options: []
)

URLSession.shared.dataTask(with: request) { data, response, error in
    guard let data = data else {
        print("Error:", error?.localizedDescription ?? "Unknown error")
        return
    }

    if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
       let success = json["success"] as? Bool, success,
       let shortUrl = json["shortUrl"] as? String {
        print("Short URL: \\(shortUrl)")
    }
}.resume()`}
                 />
               </Collapsible>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Common Use Cases</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Social Media Automation',
                  description:
                    'Shorten URLs before posting to Twitter, LinkedIn, or other social platforms.',
                  example:
                    'const shortUrl = await shorten(url);\ntweet(`Check this out: ${shortUrl}`);',
                },
                {
                  title: 'Analytics & Campaigns',
                  description:
                    'Create custom slugs for tracking different marketing campaigns.',
                  example:
                    'await shorten(url, {\n  slug: "summer-2025",\n  permanent: true\n});',
                },
                {
                  title: 'Email Templates',
                  description:
                    'Generate short links for email campaigns to save space and improve tracking.',
                  example:
                    'const links = await Promise.all(\n  urls.map(u => shorten(u))\n);',
                },
                {
                  title: 'QR Code Generation',
                  description:
                    'Combine with QR code libraries for smaller, scannable codes.',
                  example:
                    'const {shortUrl} = await shorten(url);\nqrcode.toCanvas(shortUrl);',
                },
                {
                  title: 'Mobile App Integration',
                  description:
                    'Quick integration for iOS, Android, or cross-platform apps.',
                  example:
                    'let result = try await URLSession\n  .shared.data(from: shortenURL)',
                },
                {
                  title: 'Browser Extensions',
                  description:
                    'Add URL shortening directly to your browser context menu.',
                  example:
                    'chrome.contextMenus.onClicked\n  .addListener((shortUrl) => {...});',
                },
              ].map((useCase, idx) => (
                <div
                  key={idx}
                  className="border border-border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-bold mb-2">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <div className="bg-slate-900 dark:bg-slate-800 text-slate-50 rounded p-3 text-xs font-mono overflow-x-auto">
                    {useCase.example}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6">FAQ</h2>

            <div className="space-y-4">
               {[
                 {
                   q: 'Do I need authentication?',
                   a: 'Yes! You need an API token to use the API. Generate one in your dashboard under "API Tokens" section. The token is included in the Authorization header of every request.',
                 },
                 {
                   q: 'Where do I get my API token?',
                   a: 'Sign in to your Uplink dashboard, go to "API Tokens", and click "Generate New Token". Copy it immediately - you won\'t be able to see it again!',
                 },
                 {
                   q: 'How long do my tokens last?',
                   a: 'As long as you set them to. When generating a token, choose: 7 days, 30 days, 90 days, 1 year, or never expires.',
                 },
                 {
                   q: 'What if I lose my token?',
                   a: 'You can\'t recover it. Delete the token in your dashboard and generate a new one.',
                 },
                 {
                   q: 'Can I rotate my tokens?',
                   a: 'Yes! Generate a new token, update your apps to use it, then delete the old token.',
                 },
                 {
                   q: 'How long do temporary links last?',
                   a: 'By default, 30 days. Set "permanent": true to create links that never expire.',
                 },
                 {
                   q: 'Can I track analytics?',
                   a: 'Not through the public API. Use the authenticated Uplink dashboard for detailed analytics.',
                 },
                 {
                   q: 'Can I delete links created via the API?',
                   a: 'Not through the public API. Links are managed through the web dashboard.',
                 },
                 {
                   q: 'How many links can I create?',
                   a: 'Unlimited (with reasonable use). Rate limit is 30 requests per minute per IP address.',
                 },
                 {
                   q: 'Does it work with all Uplink domains?',
                   a: 'Yes! Works with meetra.live, uplink.neopanda.tech, uplink-brocode.vercel.app, and any configured domain.',
                 },
                 {
                   q: 'Is there rate limiting?',
                   a: 'Yes, 30 requests per minute per IP address. Check X-RateLimit-Remaining header to monitor your usage.',
                 },
                 {
                   q: 'Can I use custom domains?',
                   a: 'Yes, configure additional domains in environment variables. The API uses the domain you POST to.',
                 },
               ].map((item, idx) => (
                 <Collapsible key={idx} title={item.q}>
                   <p className="text-muted-foreground">{item.a}</p>
                 </Collapsible>
               ))}
             </div>
          </section>

          {/* Footer CTA */}
           <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-lg p-8 border border-border">
             <h2 className="text-2xl font-bold mb-4">Ready to integrate?</h2>
             <p className="text-muted-foreground mb-6">
               The API is live right now. Generate your API token in the dashboard, then start shortening URLs with a single POST request. Fast, simple, and secure.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
               <a
                 href="https://github.com/BroCode501/uplink"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
               >
                 View on GitHub
                 <ExternalLink className="w-4 h-4" />
               </a>
               <a
                 href="/openapi.json"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
               >
                 OpenAPI Spec
                 <ExternalLink className="w-4 h-4" />
               </a>
               <a
                 href="https://brocode-tech.netlify.app/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-amber-700 dark:border-amber-400 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-800 rounded-lg font-semibold transition-colors"
               >
                 BroCode Community
                 <ExternalLink className="w-4 h-4" />
               </a>
             </div>
           </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Uplink Simple API v1 • Free and open source by the{' '}
              <a
                href="https://brocode-tech.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 dark:text-amber-400 hover:underline"
              >
                BroCode Tech Community
              </a>
            </p>
            <p>
              <a
                href="https://github.com/BroCode501/uplink"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 dark:text-amber-400 hover:underline"
              >
                GitHub Repository
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
