// middleware.js
import { NextResponse } from 'next/server'
import { corsMiddleware } from '@/middleware/cors'
import { rateLimitMiddleware } from '@/middleware/rate-limit'
import { securityHeadersMiddleware } from './middleware/security-headers'
import { authMiddleware } from './middleware/auth'

export function middleware(request) {
  const securityResponse = securityHeadersMiddleware(request)
  if (securityResponse) return securityResponse

  const corsResponse = corsMiddleware(request)
  if (corsResponse) return corsResponse

  const rateLimitResponse = rateLimitMiddleware(request)
  if (rateLimitResponse) return rateLimitResponse

  const authResponse = authMiddleware(request)
  if (authResponse) return authResponse

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public).*)'
  ]
}