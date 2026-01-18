const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateShortCode(length: number = 8): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return code;
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidCustomSlug(slug: string): boolean {
  // Allow only alphanumeric, hyphens, and underscores, 2-50 characters
  const slugRegex = /^[a-zA-Z0-9_-]{2,50}$/;
  return slugRegex.test(slug);
}

export function calculateExpiration(isPermanent: boolean): string | null {
  if (isPermanent) {
    return null;
  }
  // Default: 30 days
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}
