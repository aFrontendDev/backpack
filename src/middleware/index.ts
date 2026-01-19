import { lucia } from '../lib/auth';
import { defineMiddleware } from 'astro:middleware';
import { checkRateLimit, authRateLimit } from '../lib/rateLimit';

// Security headers to add to all responses
const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Get client IP from request
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const pathname = url.pathname;

  // Rate limiting for auth endpoints
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    const clientIP = getClientIP(request);
    const rateLimitKey = `auth:${clientIP}`;
    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, authRateLimit);

    if (!allowed) {
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'X-RateLimit-Remaining': '0',
            ...securityHeaders
          }
        }
      );
    }
  }

  // CSRF protection for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // Allow requests without origin header (same-origin requests from some browsers)
    // but block requests from different origins
    if (origin) {
      const originUrl = new URL(origin);
      const expectedHost = host?.split(':')[0];
      const originHost = originUrl.hostname;

      if (expectedHost && originHost !== expectedHost && originHost !== 'localhost') {
        return new Response(
          JSON.stringify({ error: 'Invalid request origin' }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              ...securityHeaders
            }
          }
        );
      }
    }
  }

  // Session validation
  const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    context.locals.user = null;
    context.locals.session = null;
    const response = await next();
    addSecurityHeaders(response);
    return response;
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }

  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie();
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  }

  context.locals.user = user;
  context.locals.session = session;

  const response = await next();
  addSecurityHeaders(response);
  return response;
});

function addSecurityHeaders(response: Response): void {
  for (const [key, value] of Object.entries(securityHeaders)) {
    if (!response.headers.has(key)) {
      response.headers.set(key, value);
    }
  }
}
