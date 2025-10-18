import { db } from "@/config/db"
import { roles } from "@/db/schema/roles.db"
import { updateRoleSchema } from "@/lib/validations/roles.schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
    try {
        const { id } = await params
        const [role] = await db.select().from(roles).where(eq(roles.id, id)).limit(1)

        if (!role) {
            return NextResponse.json({
                success: false,
                error: {
                    message: 'Role not found',
                    code: 'ROLE_NOT_FOUND'
                }
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            data: role
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching role:', error);
        return NextResponse.json({
            success: false,
            error: {
                message: 'Failed to fetch role',
                code: 'SERVER_ERROR'
            }
        }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const body = await request.json()
        const validatedData = updateRoleSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json({
                success: false,
                error: {
                    message: 'Validation failed',
                    code: 'VALIDATION_ERROR',
                    details: validatedData.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message,
                        code: err.code
                    }))
                }
            }, { status: 422 })
        }

        const [existingRole] = await db.select().from(roles).where(eq(roles.id, id)).limit(1)

        if (!existingRole) {
            return NextResponse.json({
                success: false,
                error: {
                    message: 'Role not found',
                    code: 'ROLE_NOT_FOUND',
                }
            }, { status: 404 })
        }

        if (validatedData.data.name && validatedData.data.name !== existingRole.name) {
            const [duplicateRole] = await db.select().from(roles).where(eq(roles.name, validatedData.data.name)).limit(1);

            if (duplicateRole) {
                return NextResponse.json({
                    success: false,
                    error: {
                        message: 'Role already exists',
                        code: 'ROLE_ALREADY_EXISTS'
                    }
                }, { status: 400 })
            }
        }

        const [updatedRole] = await db.update(roles)
            .set({
                ...validatedData.data,
                updatedAt: new Date()
            }).where(eq(roles.id, id)).returning()

        return NextResponse.json({
            success: true,
            data: updatedRole
        }, { status: 200 })

    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({
            success: false,
            error: {
                message: 'Failed to update role',
                code: 'SERVER_ERROR'
            }
        }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params
        const [existingRole] = await db.select().from(roles).where(eq(roles.id, id)).limit(1)

        if (!existingRole) {
            return NextResponse.json({
                success: false,
                error: {
                    message: 'Role not found',
                    code: 'ROLE_NOT_FOUND'
                }
            }, { status: 404 })
        }

        const systemRoles = ['superadmin', 'admin']
        if (systemRoles.includes(existingRole.name)) {
            return NextResponse.json({
                success: false,
                error: {
                    message: 'System roles cannot be deleted',
                    code: 'SYSTEM_ROLE_PROTECTED'
                }
            }, { status: 403 })
        }

        await db.delete(roles).where(eq(roles.id, id))

        return NextResponse.json({
            success: true,
            message: 'Role deleted successfully'
        })
    } catch (error) {
        console.error('Delete role error:', error)
        return NextResponse.json({
            success: false,
            error: {
                message: 'Failed to delete role',
                code: 'SERVER_ERROR'
            }
        }, { status: 500 })
    }
}