/**
 * Dynamic Domain Configuration System
 * 
 * This system allows Uplink to work seamlessly across multiple domains
 * without hardcoding domain values. It auto-detects the current domain
 * and can be configured with multiple allowed domains.
 */

/**
 * Get the current request domain from headers or window
 * Works in both server and client contexts
 */
export function getCurrentDomain(request?: Request | string): string {
  // Server-side (API routes)
  if (typeof request === 'string') {
    return request;
  }

  if (request && 'headers' in request) {
    const host = request.headers.get('x-forwarded-host') || 
                 request.headers.get('host') || 
                 '';
    if (host) {
      // Remove port if present
      const domain = host.split(':')[0];
      return `https://${domain}`;
    }
  }

  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Fallback (should rarely happen)
  return process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'https://meetra.live';
}

/**
 * Parse environment variable for allowed domains
 * Format: "domain1.com,domain2.com,domain3.com"
 * Returns array of full HTTPS URLs
 */
export function getAllowedDomains(): string[] {
  const domainsEnv = process.env.NEXT_PUBLIC_SHORT_URL_DOMAINS || '';
  
  if (!domainsEnv) {
    // Fallback to legacy single domain variable
    const singleDomain = process.env.NEXT_PUBLIC_SHORT_URL_BASE || 'meetra.live';
    return [ensureHttpsUrl(singleDomain)];
  }

  return domainsEnv
    .split(',')
    .map(domain => domain.trim())
    .filter(domain => domain.length > 0)
    .map(ensureHttpsUrl);
}

/**
 * Ensure a domain string is a full HTTPS URL
 */
function ensureHttpsUrl(domain: string): string {
  // Remove trailing slash
  domain = domain.replace(/\/$/, '');
  
  // Add https:// if not present
  if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
    domain = `https://${domain}`;
  }
  
  return domain;
}

/**
 * Validate if a given domain is allowed
 */
export function isAllowedDomain(domain: string): boolean {
  const allowedDomains = getAllowedDomains();
  const normalizedDomain = ensureHttpsUrl(domain);
  return allowedDomains.includes(normalizedDomain);
}

/**
 * Get the current request's short URL base
 * This is the URL that will be used for shortened links
 */
export function getShortUrlBase(request?: Request | string): string {
  const currentDomain = getCurrentDomain(request);
  const allowedDomains = getAllowedDomains();

  // If current domain is in allowed list, use it
  if (allowedDomains.includes(currentDomain)) {
    return currentDomain;
  }

  // Verify current domain is a valid URL
  try {
    const url = new URL(currentDomain);
    const normalizedCurrent = `${url.protocol}//${url.hostname}`;
    
    // Check if normalized version is in allowed list
    const normalized = allowedDomains.map(d => {
      const u = new URL(d);
      return `${u.protocol}//${u.hostname}`;
    });

    const foundMatch = normalized.find(d => d === normalizedCurrent);
    if (foundMatch) {
      // Return the original URL with the current domain
      return currentDomain;
    }
  } catch (e) {
    console.error('Invalid domain URL:', currentDomain, e);
  }

  // Fallback to first allowed domain
  return allowedDomains[0];
}

/**
 * Get domain configuration for client-side usage
 * Safe to expose to frontend
 */
export function getDomainConfig() {
  return {
    allowedDomains: getAllowedDomains(),
    currentDomain: typeof window !== 'undefined' ? window.location.origin : null,
  };
}

/**
 * Format a short code as a full shortened URL
 */
export function formatShortUrl(shortCode: string, baseUrl?: string): string {
  const base = baseUrl || getShortUrlBase();
  return `${base}/${shortCode}`;
}

/**
 * Extract short code from a shortened URL
 */
export function extractShortCode(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Remove leading/trailing slashes
    const code = pathname.replace(/^\/|\/$/g, '');
    
    return code || null;
  } catch (e) {
    return null;
  }
}

/**
 * Get domain statistics for display
 */
export function getDomainStats() {
  const allowedDomains = getAllowedDomains();
  
  return {
    totalDomains: allowedDomains.length,
    domains: allowedDomains,
    isPrimary: (domain: string) => domain === allowedDomains[0],
  };
}

/**
 * Middleware to ensure valid domain usage
 */
export function validateDomainMiddleware(request: Request): Response | null {
  const domain = getCurrentDomain(request);
  
  if (!isAllowedDomain(domain)) {
    console.warn(`Request from non-allowed domain: ${domain}`);
    // Allow it anyway, but log it
    // Return null to continue processing
  }
  
  return null;
}
