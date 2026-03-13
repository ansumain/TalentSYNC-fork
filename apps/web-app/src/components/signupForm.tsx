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
import { AUTH } from "@/constants/auth"

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
            toast.success(`${AUTH.SIGNUP.ACCOUNT_CREATED} ${response.name}`)
            navigate('/signin')
        } catch (error) {
            const err = error as { message: string; status?: number }
            toast.error(err.message || AUTH.SIGNUP.REG_FAILED)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col" )}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{AUTH.SIGNUP.CREATE}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">{AUTH.SIGNUP.NAME}</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={AUTH.SIGNUP.ENTER_NAME}
                                    {...register("name")}
                                    disabled={isLoading}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 text-left">{errors.name.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">{AUTH.SIGNUP.EMAIL}</FieldLabel>
                                <Input
                                    id="email"
                                    placeholder={AUTH.SIGNUP.ENTER_EMAIL}
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 text-left">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">{AUTH.SIGNUP.PHONE}</FieldLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder={AUTH.SIGNUP.ENTER_PHONE}
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
                                        <FieldLabel htmlFor="password">{AUTH.SIGNUP.PASSWORD}</FieldLabel>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder={AUTH.SIGNUP.CREATE_PASSWORD}
                                            {...register("password")}
                                            disabled={isLoading}
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-red-500">{errors.password.message}</p>
                                        )}
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="confirmPassword">
                                            {AUTH.SIGNUP.CONFIRM_PASSWORD}
                                        </FieldLabel>
                                        <Input
                                            id="confirmPassword"
                                            type="text"
                                            placeholder={AUTH.SIGNUP.CREATE_CONFIRM_PASSWORD}
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
                                    {isLoading ? AUTH.SIGNUP.CREATING_ACC : AUTH.SIGNUP.CREATE_ACC}
                                </Button>
                                <FieldDescription className="text-center">
                                    {AUTH.SIGNUP.HAVE_ACCOUNT}{" "}
                                    <Link to="/signin" className="underline">{AUTH.SIGNUP.SIGNIN}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
