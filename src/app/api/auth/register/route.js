import { registerSchema } from "@/lib/validations/auth.schema"
import AuthService from "@/services/auth.service"
import { NextResponse } from "next/server"


export async function POST(request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)
    const result = await AuthService.register(validatedData)

    if (!result.success) {
      return NextResponse.json({
        status: false,
        message: result.message || 'Registration failed'
      }, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
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