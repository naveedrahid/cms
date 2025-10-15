import { loginSchema } from "@/lib/validations/auth.schema"
import AuthService from "@/services/auth.service"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const body = await request.json()
        const validatedData = loginSchema.parse(body)
    
        const result = await AuthService.login(
            validatedData.email,
            validatedData.password
        )

        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: result.message || 'Login failed'
            }, { status: 401 })
        }

        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: result.user
            },
            { status: 200 }
        )

        response.cookies.set('session_token', result.user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60,
            path: '/'
        })
        
        return response
        
    } catch (error) {

        if (error.name === 'ZodError') {
            return NextResponse.json({
                success: false,
                error: 'Validation Error',
                details: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            }, { status: 400 })
        }

        if (error.message.includes('Invalid') || error.message.includes('verify')) {
            return NextResponse.json({
                success: false,
                message: error.message
            }, { status: 401 })
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error - ' + error.message },
            { status: 500 }
        )
    }
}