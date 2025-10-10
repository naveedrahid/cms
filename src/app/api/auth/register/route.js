import { SecureCookieService } from "@/lib/auth/cookies"
import { RequestHandler } from "@/lib/request-handler"
import { registerSchema } from "@/lib/validations/auth.schema"
import AuthService from "@/services/auth.service"
import { NextResponse } from "next/server"


async function registerHandler(request) {
  try {
    const contentTypeError = RequestHandler.validateContentType(request)
    if (contentTypeError) return contentTypeError

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

    const body = await request.json();
    const validatedData = registerSchema.parse(body)
    const result = await AuthService.register(validatedData)

    const response = NextResponse.json(result, { status: 201 })
    SecureCookieService.setAuthCookies(response, result.accessToken, result.refreshToken)

    return response
  } catch (error) {
    console.error("Register API error:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    if (error.message.includes("already exists")) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

export const POST = RequestHandler.withTimeout(registerHandler, 15000)

export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token'
    }
  });
}