import z from "zod";

export const createRolesSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().optional(),
    guardName: z.string().default('web'),
})

export const updateRoleSchema = z.object({
    name: z.string().min(2).max(50),
    description: z.string().optional(),
    guardName: z.string().default('web'),
})