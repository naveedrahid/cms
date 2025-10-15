import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  const publicPaths = ['/auth/login', '/auth/register', '/api/auth/login', '/api/auth/register']
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('session_token')?.value
  
  if (!sessionToken && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(
      new URL('/auth/login?message=Please login first', request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*'
  ]
}