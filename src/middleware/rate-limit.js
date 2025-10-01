import { apiRateLimiter, authRateLimiter } from "@/lib/rateLimiter";

export function rateLimitMiddleware(request) {
    const ip = request.ip ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        'unknown';

    let rateLimiter;

    if (request.nextUrl.pathname.startsWith('/api/auth')) {
        rateLimiter = authRateLimiter;
    } else {
        rateLimiter = apiRateLimiter;
    }

    if (!rateLimiter.isAllowed(ip)) {
        return new Response(
            JSON.stringify({
                error: 'Too Many Requests',
                message: 'Rate limit exceeded',
                retryAfter: 60
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': '60'
                }
            }
        );
    }

    return null;
}