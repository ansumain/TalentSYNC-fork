import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authService } from "@/lib/api/auth.service"
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth.schema"

export function SignupForm() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true)

        try {
            const response = await authService.register({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            })
            toast.success(`Account created successfully! \nWelcome, ${response.name}`)
            navigate('/signin')
        } catch (error) {
            const err = error as { message: string; status?: number }
            toast.error(err.message || 'Registration failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col" )}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create your account</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Name</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    {...register("name")}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 text-left">{errors.name.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 text-left">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    maxLength={10}
                                    {...register("phone")}
                                    disabled={isLoading}
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-500 text-left">{errors.phone.message}</p>
                                )}
                            </Field>
                            <Field>
                                <Field className="grid grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Create password"
                                            {...register("password")}
                                            disabled={isLoading}
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-red-500">{errors.password.message}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            Confirm Password
                                        </FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="text"
                                            placeholder="Confirm password"
                                            {...register("confirmPassword")}
                                            disabled={isLoading}
                                        />
                                        {errors.confirmPassword && (
                                            <p className="text-xs text-red-500 text-left">{errors.confirmPassword.message}</p>
                                        )}
                                    </Field>
                                </Field>
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Creating account...' : 'Create account'}
                                </Button>
                                <FieldDescription className="text-center">
                                    Already have an account?{" "}
                                    <Link to="/signin" className="underline">Sign in</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
