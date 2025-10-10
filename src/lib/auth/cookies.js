import { cookies } from 'next/headers'

export class SecureCookieService {
    static setAuthCookies(response, accessToken, refreshToken) {
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || 'localhost'
        })

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || 'localhost'
        })

        // CSRF Token Cookie
        const csrfToken = this.generateCSRFToken()
        response.cookies.set('csrfToken', csrfToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/',
            domain: process.env.COOKIE_DOMAIN || 'localhost'
        })

        return csrfToken
    }

    static generateCSRFToken() {
        if (typeof crypto !== 'undefined' && crypto.randomBytes) {
            return crypto.randomBytes(32).toString('hex')
        } else {
            const array = new Uint8Array(32)
            crypto.getRandomValues(array)
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
        }
    }

    static validateCSRFToken(request) {
        const cookieCSRFToken = request.cookies.get('csrfToken')?.value
        const headerCSRFToken = request.headers.get('x-csrf-token')

        return cookieCSRFToken && headerCSRFToken && cookieCSRFToken === headerCSRFToken
    }

    static clearAuthCookies(response) {
        const cookieOptions = {
            path: '/',
            domain: process.env.COOKIE_DOMAIN || 'localhost'
        }

        response.cookies.delete('accessToken', cookieOptions)
        response.cookies.delete('refreshToken', cookieOptions)
        response.cookies.delete('csrfToken', cookieOptions)
    }
}