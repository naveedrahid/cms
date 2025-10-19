import { z } from 'zod'

export const assignUserRoleSchema = z.object({
    userId: z.string().uuid('Invalid user ID'),
    roleId: z.string().uuid('Invalid role ID')
})

export const removeUserRoleSchema = z.object({
    id: z.string().uuid('Invalid user role ID')
})

export const userRoleQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
    userId: z.string().uuid('Invalid user ID').optional(),
    roleId: z.string().uuid('Invalid role ID').optional()
})