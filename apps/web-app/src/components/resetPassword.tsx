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
            toast.success(response.message || 'Password reset successfully!');
            navigate('/signin', { replace: true });
        } catch (error) {
            const err = error as { message: string };
            toast.error(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        OTP sent to your registered mail
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    disabled={true}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">OTP</FieldLabel>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter OTP from registered mail"
                                    maxLength={6}
                                    {...register("otp")}
                                    disabled={isLoading}
                                />
                                {errors.otp && (
                                    <p className="text-sm text-red-500 text-left">{errors.otp.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Create new password"
                                    {...register("newPassword")}
                                    disabled={isLoading}
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500 text-left">{errors.newPassword.message}</p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Resetting password...' : 'Reset Password'}
                                </Button>
                                <FieldDescription className="text-center">
                                    Remember your password?{" "}
                                    <Link to="/signin" className="underline">Sign In</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
