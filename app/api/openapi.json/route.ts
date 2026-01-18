import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getAllowedDomains, getPrimaryDomain } from '@/lib/domain-config';

export async function GET(request: NextRequest) {
  try {
    // Read the OpenAPI spec from public directory
    const specPath = join(process.cwd(), 'public', 'openapi.json');
    const specContent = readFileSync(specPath, 'utf-8');
    const spec = JSON.parse(specContent);

    // Get configured domains
    const allowedDomains = getAllowedDomains();
    const primaryDomain = getPrimaryDomain();

    // Get current request domain
    const host = request.headers.get('host') || '';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const currentServer = host ? `${protocol}://${host}` : null;

    // Build servers array
    // Start with primary domain
    const servers = [
      {
        url: primaryDomain,
        description: 'Production (Primary Domain)',
      },
    ];

    // Add other configured domains (if not primary)
    allowedDomains.forEach((domain) => {
      if (domain !== primaryDomain && !servers.some((s) => s.url === domain)) {
        servers.push({
          url: domain,
          description: 'Production (Alternative Domain)',
        });
      }
    });

    // Add current server if it's not already listed and not localhost
    if (
      currentServer &&
      !servers.some((s) => s.url === currentServer) &&
      !host?.includes('localhost')
    ) {
      servers.unshift({
        url: currentServer,
        description: 'Current Server',
      });
    }

    // Add localhost if not present
    if (!servers.some((s) => s.url.includes('localhost'))) {
      servers.push({
        url: 'http://localhost:3000',
        description: 'Local Development',
      });
    }

    // Update spec with actual servers
    spec.servers = servers;

    const response = NextResponse.json(spec);
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return response;
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load API specification',
      },
      { status: 500 }
    );
  }
}
