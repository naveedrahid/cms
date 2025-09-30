import { loginSchema } from "@/lib/validations/auth.schema"
import { AuthService } from "@/services/auth.service"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const body = await request.json()
        const validatedData = loginSchema.parse(body)
        const result = await AuthService.login(
            validatedData.email,
            validatedData.password,
        )

        return NextResponse.json(result, { status: 200 })
    } catch (error) {
        console.error('Login API Error:', error);
        if (error.name === 'ZodError') {
            return NextResponse.json({
                status: false,
                error: 'Validation Error',
                details: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            }, { status: 400 })
        }

        if (error.message.includes('Invalid') || error.message.includes('verify')) {
            return NextResponse.json({
                status: false,
                message: error.message
            }, { status: 401 })
        }

        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}