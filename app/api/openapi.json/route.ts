import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Read the OpenAPI spec from public directory
    const specPath = join(process.cwd(), 'public', 'openapi.json');
    const specContent = readFileSync(specPath, 'utf-8');
    const spec = JSON.parse(specContent);

    // Get current host to update servers
    const host = request.headers.get('host') || 'meetra.live';
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const currentServer = `${protocol}://${host}`;

    // Add current server if not already present
    const serverExists = spec.servers.some(
      (s: { url: string }) => s.url === currentServer
    );

    if (!serverExists && host !== 'localhost' && host !== 'localhost:3000') {
      spec.servers.unshift({
        url: currentServer,
        description: 'Current Server',
      });
    }

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
