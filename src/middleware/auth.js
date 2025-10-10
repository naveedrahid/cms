import { NextResponse } from 'next/server'
import { TokenService } from '@/lib/auth/token'

export function authMiddleware(request) {
    const path = request.nextUrl.pathname
    const isPublicPath = path.startsWith('/auth') || path === '/'

    if (isPublicPath) {
        return null
    }

    if (path.startsWith('/api')) {
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Authentication required'
                }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }

        const token = authHeader.substring(7)

        try {
            const decoded = TokenService.verifyToken(token)
            // Add user info to request headers for API routes
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('x-user-id', decoded.userId)
            requestHeaders.set('x-user-email', decoded.email)
            requestHeaders.set('x-user-role', decoded.role)

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                }
            })
        } catch (error) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid or expired token'
                }),
                {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
    }

    const token = request.cookies.get('accessToken')?.value

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
        TokenService.verifyToken(token)
        return null
    } catch (error) {
        const response = NextResponse.redirect(new URL('/auth/login', request.url))
        response.cookies.delete('accessToken')
        return response
    }
}