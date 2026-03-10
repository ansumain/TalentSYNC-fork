import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
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
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth.schema";
import { AUTH } from "@/constants/auth";

export function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        const email = location.state?.email;
        if (email) {
            setValue("email", email);
        }
    }, [location.state, setValue]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);

        try {
            const response = await authService.resetPassword(data);
            toast.success(response.message || AUTH.RESET_PASSWORD.PASSWORD_RESET);
            navigate('/signin', { replace: true });
        } catch (error) {
            const err = error as { message: string };
            toast.error(err.message || AUTH.RESET_PASSWORD.PASSWORD_RESET_FAILED);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{AUTH.RESET_PASSWORD.RESET}</CardTitle>
                    <CardDescription>
                        {AUTH.RESET_PASSWORD.OTP_SENT}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">{AUTH.RESET_PASSWORD.EMAIL}</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    disabled={true}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">{AUTH.RESET_PASSWORD.OTP}</FieldLabel>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder={AUTH.RESET_PASSWORD.ENTER_OTP}
                                    maxLength={6}
                                    {...register("otp")}
                                    disabled={isLoading}
                                />
                                {errors.otp && (
                                    <p className="text-sm text-red-500 text-left">{errors.otp.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="newPassword">{AUTH.RESET_PASSWORD.NEW_PASSWORD}</FieldLabel>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder={AUTH.RESET_PASSWORD.CREATE_NEW_PASSWORD}
                                    {...register("newPassword")}
                                    disabled={isLoading}
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500 text-left">{errors.newPassword.message}</p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? AUTH.RESET_PASSWORD.RESETTING_PASSWORD : AUTH.RESET_PASSWORD.RESET_PASSWORD}
                                </Button>
                                <FieldDescription className="text-center">
                                    {AUTH.RESET_PASSWORD.REMEMBER_PASSWORD}{" "}
                                    <Link to="/signin" className="underline">{AUTH.RESET_PASSWORD.SIGNIN}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
