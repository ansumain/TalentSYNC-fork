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
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authService } from "@/lib/api/auth.service"
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema"
import { useAuthStore } from "@/stores/authStore"
import { AUTH } from "@/constants/auth"
import { getDefaultRouteForRoles } from "@/lib/auth/defaultRoute"

export function LoginForm() {
  const navigate = useNavigate()
  const fetchUser = useAuthStore((state) => state.fetchUser)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      const response = await authService.login(data)
      toast.success(response.message || AUTH.LOGIN.LOGGEDIN)
      await fetchUser()
      const updatedUser = useAuthStore.getState().user
      navigate(getDefaultRouteForRoles(updatedUser?.roles), { replace: true })
    } catch (error) {
      const err = error as { message: string; status?: number }
      toast.error(err.message || AUTH.LOGIN.NOT_LOGGEDIN)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{AUTH.LOGIN.WELCOME}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{AUTH.LOGIN.EMAIL}</FieldLabel>
                <Input
                  id="email"
                  placeholder={AUTH.LOGIN.ENTER_EMAIL}
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 text-left">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">{AUTH.LOGIN.PASSWORD}</FieldLabel>
                  <Link to="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                    {AUTH.LOGIN.FORGOT_PASSWORD}
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  placeholder={AUTH.LOGIN.ENTER_PASSWORD}
                  {...register("password")}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 text-left">{errors.password.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? AUTH.LOGIN.SIGNING_IN : AUTH.LOGIN.SIGN_IN}
                </Button>
                <FieldDescription className="text-center">
                  {AUTH.LOGIN.NO_ACCOUNT}{" "}
                  <Link to="/signup" className="underline">{AUTH.LOGIN.SIGNUP}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
