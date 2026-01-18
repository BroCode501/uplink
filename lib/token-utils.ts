import crypto from 'crypto';

/**
 * Generate a random API token
 * Format: uplink_[random base64 string]
 * Length: 32 random bytes = 43 chars in base64 + 7 char prefix = ~50 chars total
 */
export function generateToken(): string {
  const randomBytes = crypto.randomBytes(32);
  const base64 = randomBytes.toString('base64url');
  return `uplink_${base64}`;
}

/**
 * Hash an API token for secure storage
 * Uses SHA-256
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify a token matches its hash
 */
export function verifyToken(token: string, hash: string): boolean {
  const computedHash = hashToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(computedHash),
    Buffer.from(hash)
  );
}

/**
 * Extract token from Authorization header
 * Expected format: "Bearer uplink_xxxxx"
 */
export function extractToken(authHeader: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice(7); // Remove "Bearer "
  if (!token.startsWith('uplink_')) {
    return null;
  }
  return token;
}

/**
 * Validate token format
 */
export function isValidTokenFormat(token: string): boolean {
  return token.startsWith('uplink_') && token.length > 10;
}
