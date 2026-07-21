import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// ─── Blocked Paths (scanner bait / sensitive files) ──────────────────────────
const BLOCKED_PATHS = [
  '/wp-admin', '/wp-login', '/wp-content', '/wp-includes',
  '/.env', '/.env.local', '/.env.production',
  '/.git', '/.gitignore', '/.github',
  '/phpMyAdmin', '/phpmyadmin', '/pma',
  '/shell.php', '/admin.php', '/config.php', '/setup.php',
  '/backup', '/dump.sql', '/db.sql', '/database.sql',
  '/actuator', '/actuator/health', '/actuator/env',
  '/.DS_Store', '/Thumbs.db',
  '/xmlrpc.php', '/wp-cron.php',
  '/etc/passwd', '/etc/shadow', '/proc/self/environ',
  '/api/config', '/config.json', '/secrets.json',
  '/swagger', '/swagger-ui', '/api-docs', '/openapi.json',
  '/graphql-playground', '/graphiql',
  '/server-status', '/server-info',
  '/console', '/jmx-console', '/web-console',
  '/../', '/..%2f', '/%2e%2e',
  '/cgi-bin', '/cgi-bin/bash',
  '/vendor/phpunit', '/laravel',
  '/telescope', '/horizon',
  '/_profiler', '/_wdt',
  '/trace', '/debug/vars',
];

// ─── Malicious Bot User-Agents ────────────────────────────────────────────────
const BLOCKED_BOT_PATTERNS = [
  // Security scanners
  /sqlmap/i, /nikto/i, /nessus/i, /masscan/i,
  /nmap/i, /zgrab/i, /dirbuster/i, /gobuster/i,
  /wfuzz/i, /burpsuite/i, /acunetix/i, /openvas/i,
  /skipfish/i, /zap/i, /w3af/i, /arachni/i,
  /hydra/i, /medusa/i, /metasploit/i,
  /havij/i, /pangolin/i, /sqlninja/i,
  // Scrapers
  /scrapy/i, /wget\//i, /libwww-perl/i,
  /python-requests\/[01]\./i, /curl\/[0-7]\./i,
  /go-http-client\/1\./i,
  // Old/suspicious
  /jakarta/i, /java\/1\.[0-6]/i,
];

// ─── Security Headers ─────────────────────────────────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  'X-Frame-Options': 'SAMEORIGIN',
  // Prevent MIME sniffing
  'X-Content-Type-Options': 'nosniff',
  // XSS filter
  'X-XSS-Protection': '1; mode=block',
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // HSTS (HTTPS only)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  // Permissions
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()',
  // CORP
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  // CSP - Content Security Policy (strict)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sanity.io",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://cdn.sanity.io https://*.supabase.co",
    "connect-src 'self' https://*.sanity.io https://*.supabase.co https://api.telegram.org",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  // DNS prefetch
  'X-DNS-Prefetch-Control': 'off',
  // Prevent IE compatibility mode
  'X-UA-Compatible': 'IE=edge',
};

// ─── Rate Limiting (simple in-memory per edge) ────────────────────────────────
const ipRequestCount = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 120;       // max requests
const RATE_WINDOW = 60 * 1000; // per 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestCount.get(ip);

  if (!record || now - record.windowStart > RATE_WINDOW) {
    ipRequestCount.set(ip, { count: 1, windowStart: now });
    return false;
  }

  record.count++;
  if (record.count > RATE_LIMIT) return true;
  return false;
}

// ─── Suspicious Query String Patterns ────────────────────────────────────────
const SUSPICIOUS_QS = [
  /<script/i, /javascript:/i, /onerror=/i, /onload=/i,
  /SELECT.*FROM/i, /UNION.*SELECT/i, /DROP\s+TABLE/i,
  /INSERT\s+INTO/i, /exec\(/i, /eval\(/i,
  /base64_decode/i, /\.\.\//,
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // ── 1. Bot Protection ────────────────────────────────────────────
  if (BLOCKED_BOT_PATTERNS.some(p => p.test(userAgent))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 2. Empty User-Agent (raw scanners) ──────────────────────────
  if (!userAgent || userAgent.length < 5) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 3. Blocked Paths ─────────────────────────────────────────────
  const lowerPath = pathname.toLowerCase();
  if (BLOCKED_PATHS.some(p => lowerPath.includes(p.toLowerCase()))) {
    return new NextResponse('Not Found', { status: 404 });
  }

  // ── 4. Path Traversal Detection ──────────────────────────────────
  if (pathname.includes('..') || pathname.includes('%2e%2e') || pathname.includes('%252e')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── 5. Suspicious Query Strings (SQLi / XSS) ────────────────────
  if (search && SUSPICIOUS_QS.some(p => p.test(decodeURIComponent(search)))) {
    return new NextResponse('Bad Request', { status: 400 });
  }

  // ── 6. Rate Limiting ─────────────────────────────────────────────
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: { 'Retry-After': '60' },
    });
  }

  // ── 7. Admin Auth Guard ──────────────────────────────────────────
  // (The admin page itself handles auth via cookies + server actions)

  // ── 8. i18n Routing (skip for admin/api/studio) ──────────────────
  const response = intlMiddleware(request);

  // ── 9. Apply Security Headers ────────────────────────────────────
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ── 10. Remove Fingerprinting Headers ────────────────────────────
  response.headers.delete('X-Powered-By');
  response.headers.delete('Server');

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files, api, studio, admin, _next
    '/((?!api|studio|admin|_next/static|_next/image|_vercel|favicon.ico|.*\\..*).*)',
    '/(ar|en)/:path*',
  ],
};
