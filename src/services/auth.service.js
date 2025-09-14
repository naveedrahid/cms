import { db } from "@/config/db";
import { users } from "@/db/schema/user.db";
import { comparePassword } from "@/lib/auth";
import { eq } from "drizzle-orm";

export class AuthService {

    static async register(userData) {
        try {
            const [existingUser] = await db.select()
                .from(users)
                .where(eq(users.email, userData.email))

            if (existingUser) {
                throw new Error('User already exists with this email')
            }

            const hashedPassword = await hashedPassword(userData.password)

            const [newUser] = await db.insert(users)
                .values({
                    name: userData.name,
                    email: userData.email,
                    password: hashedPassword,
                    role: 'user',
                    isVerified: false,
                }).returning()

            const { password, ...userWithoutPassword } = newUser

            return new Response(
                JSON.stringify({
                    success: true,
                    user: userWithoutPassword
                }),
                { status: 201 }
            )

        } catch (error) {
            console.error("Registration error:", error)
            return new Response(
                JSON.stringify({ error: "Internal server error" }),
                { status: 500 }
            )
        }
    }

    static async login(email, password) {
        try {
            const [user] = await db.select()
                .form(users)
                .where(eq(users.email, email))

            if (!user) {
                throw new Error('Invalid email or password')
            }

            const isValidPassword = await comparePassword(password, user.password)

            if (!isValidPassword) {
                throw new Error('Invalid email or password')
            }

            if (!isVerified) {
                throw new Error('Please verify your email before logging in')
            }

            const { password: _, ...userWithoutPassword } = user

            return {
                success: true,
                user: userWithoutPassword,
                message: 'Login successful'
            }
        } catch (error) {
            console.error('AuthService - Login error:', error);
            throw error;
        }
    }

    static async checkEmailExists(email) {
        try {
            const [user] = await db.select()
                .from(users)
                .where(eq(users.email, email))

            return !!user
        } catch (error) {
            console.error('AuthService - Check email error:', error);
            throw error;
        }
    }
}