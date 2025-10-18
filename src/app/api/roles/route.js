import { db } from "@/config/db";
import { roles } from "@/db/schema/roles.db";
import { createRolesSchema } from "@/lib/validations/roles.schema";
import { sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const offset = (page - 1) * limit;

        const countResult = await db.select({ count: sql`count(*)` }).from(roles);
        const totalCount = parseInt(countResult[0].count);

        const rolesList = await db.select()
            .from(roles)
            .orderBy(roles.name)
            .limit(limit)
            .offset(offset);

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            success: true,
            data: rolesList,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }, { status: 200 });

    } catch (error) {
        console.error('❌ Roles fetch error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || "Internal server error"
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const validatedData = createRolesSchema.safeParse(body)

        if (!validatedData.success) {
            return NextResponse.json({
                success: false,
                error: 'Validation failed',
                details: validatedData.error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }))
            }, { status: 422 })
        }

        const existingRole = await db.select().from(roles).where(eq(roles.name, validatedData.data.name)).limit(1)

        if (existingRole.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Role already exists"
                },
                {
                    status: 400
                }
            );
        }

        const [newRole] = await db.insert(roles).values(validatedData.data).returning()

        return NextResponse.json(
            {
                success: true,
                data: newRole,
                message: 'Role created successfully'
            },
            {
                status: 201
            }
        );
    } catch (error) {
        console.error('Role creation error', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { success: false, error: 'Validation failed', details: error.errors },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { success: false, error: 'Failed to create role' },
            { status: 500 }
        )
    }
}