"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import axios from "axios"

const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export default function RegisterPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "" }
    })

    const onSubmit = async (values) => {
        try {
            const res = await axios.post("/api/auth/register", values)
            if (res.status === 200) router.push("/auth/login")
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div className="min-h-screen grid place-items-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" {...register("email")} />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" {...register("password")} />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                    <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Register"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/auth/login")}>
                        Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}