import { SecureCookieService } from "@/lib/auth/cookies"
import { RequestHandler } from "@/lib/request-handler"
import { loginSchema } from "@/lib/validations/auth.schema"
import AuthService from "@/services/auth.service"
import { NextResponse } from "next/server"


async function loginHandler(request) {
    try {
        const constentTypeError = RequestHandler.validateContentType(request)
        if (constentTypeError) return constentTypeError

        const bodySizeError = RequestHandler.checkBodySize(request, 1)
        if (bodySizeError) return bodySizeError
        
        if (request.method === 'POST') {
            const isCSRFValid = SecureCookieService.validateCSRFToken(request)
            if (!isCSRFValid) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        error: 'Invalid CSRF token'
                    }),
                    { status: 403 }
                )
            }
        }

        const body = await request.json()
        const validatedData = loginSchema.parse(body)

        const result = await AuthService.login(
            validatedData.email,
            validatedData.password
        )

        const response = NextResponse.json(result, { status: 200 })
        SecureCookieService.setAuthCookies(response, result.accessToken, result.refreshToken)

        return response
    } catch (error) {
        console.error('Login API Error:', error)

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
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export const POST = RequestHandler.withTimeout(loginHandler, 15000)

export const OPTIONS = async () => {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token'
        }
    })
}


// import { loginSchema } from "@/lib/validations/auth.schema"
// import { AuthService } from "@/services/auth.service"
// import { NextResponse } from "next/server"

// export async function POST(request) {
//     try {
//         const body = await request.json()
//         const validatedData = loginSchema.parse(body)
//         const result = await AuthService.login(
//             validatedData.email,
//             validatedData.password,
//         )

//         return NextResponse.json(result, { status: 200 })
//     } catch (error) {
//         console.error('Login API Error:', error);
//         if (error.name === 'ZodError') {
//             return NextResponse.json({
//                 status: false,
//                 error: 'Validation Error',
//                 details: error.errors.map(err => ({
//                     field: err.path[0],
//                     message: err.message
//                 }))
//             }, { status: 400 })
//         }

//         if (error.message.includes('Invalid') || error.message.includes('verify')) {
//             return NextResponse.json({
//                 status: false,
//                 message: error.message
//             }, { status: 401 })
//         }

//         return NextResponse.json(
//             { success: false, error: 'Internal server error' },
//             { status: 500 }
//         )
//     }
// }