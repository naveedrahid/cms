import { SecureCookieService } from '@/lib/auth/cookies'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const csrfToken = SecureCookieService.generateCSRFToken()

        const response = NextResponse.json({
            success: true,
            csrfToken
        })

        response.cookies.set('csrfToken', csrfToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60,
            path: '/'
        })

        return response

    } catch (error) {
        console.error('CSRF Token API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate CSRF token' },
            { status: 500 }
        )
    }
}

export const OPTIONS = async () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    })
}