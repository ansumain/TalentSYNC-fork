import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/api/auth.service";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth.schema";
import { AUTH } from "@/constants/auth";
import { COMMON_MESSAGE } from "@/constants/common";

export function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const response = await authService.forgotPassword(data);
      toast.success(response.message || AUTH.FORGOT_PASSWORD.OTP_SENT);
      // Navigate to reset password page with email in state
      navigate('/reset-password', { state: { email: data.email } });
    } catch (error) {
      const err = error as { message: string };
      toast.error(err.message || AUTH.FORGOT_PASSWORD.OTP_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{AUTH.FORGOT_PASSWORD.FORGOT_PASSWORD}</CardTitle>
          <CardDescription>
            {AUTH.FORGOT_PASSWORD.ENTER_EMAIL}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">{AUTH.FORGOT_PASSWORD.EMAIL}</FieldLabel>
                <Input
                  id="email"
                  placeholder={AUTH.FORGOT_PASSWORD.ENTER_EMAIL}
                  {...register("email")}
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 text-left">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? AUTH.FORGOT_PASSWORD.SENDING_OTP : COMMON_MESSAGE.CONTINUE}
                </Button>
                <FieldDescription className="text-center">
                  {AUTH.FORGOT_PASSWORD.REMEMBER_PASSWORD}{" "}
                  <Link to="/signin" className="underline">{AUTH.FORGOT_PASSWORD.SIGNIN}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
