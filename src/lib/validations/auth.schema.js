import { email, z } from 'zod'

export const registerSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters")
        .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

    email: z.string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
})

export const loginSchema = z.object({
    email: z.string()
        .email("Please enter a valid email address"),

    password: z.string()
        .min(8, "Password is required")
})