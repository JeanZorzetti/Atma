import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Log detalhado de TODOS os requests para debug
  console.log('🔍 MIDDLEWARE DEBUG:', {
    url: url.pathname,
    method: request.method,
    timestamp: new Date().toISOString(),
    headers: {
      host: request.headers.get('host'),
      userAgent: request.headers.get('user-agent')?.substring(0, 50),
    }
  });

  // Se for request de chunk e der 404, logar detalhes
  if (url.pathname.includes('/_next/static/chunks/')) {
    console.log('🚨 CHUNK REQUEST DETECTED:', {
      fullPath: url.pathname,
      searchParams: url.search,
      isMainJs: url.pathname.includes('main.js'),
      isPolyfillsJs: url.pathname.includes('polyfills.js'),
      hasHash: /[a-f0-9]{16,}/.test(url.pathname),
    });
  }

  return NextResponse.next();
}

// Configurar matcher para rodar em todas as rotas
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files that should pass through)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
