import z from "zod";

export const permissionSchema = z.object({
    name: z.string()
        .min(2, 'Permission name must be at least 2 characters')
        .max(50, 'Permission name must be less than 50 characters')
        .regex(/^[a-zA-Z_]+$/, 'Permission name can only contain letters and underscores'),
    description: z.string()
        .min(2, 'Permission description must be at least 2 characters')
        .optional(),
})

export const assignPermissionsSchema = z.object({
    permissionIds: z.array(z.string().uuid('Invalid permission ID'))
        .min(1, 'At least one permission must be selected')
})

export const paginationSchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10)
}).refine(data => data.page > 0, {
    message: 'Page must be greater than 0'
}).refine(data => data.limit > 0 && data.limit <= 100, {
    message: 'Limit must be between 1 and 100'
})

export const permissionQuerySchema = paginationSchema.extend({
    search: z.string().optional()
})