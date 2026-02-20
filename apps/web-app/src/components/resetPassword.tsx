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

export function ResetPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
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

    // Pre-fill email if coming from forgot password page
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
            navigate('/signin');
        } catch (error) {
            const err = error as { message: string };
            toast.error(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter the OTP sent to your email and your new password
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
                                    placeholder="you@example.com"
                                    {...register("email")}
                                    disabled={isLoading}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">OTP (6 digits)</FieldLabel>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    {...register("otp")}
                                    disabled={isLoading}
                                />
                                {errors.otp && (
                                    <p className="text-sm text-red-500">{errors.otp.message}</p>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    {...register("newPassword")}
                                    disabled={isLoading}
                                />
                                {errors.newPassword && (
                                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                                )}
                                <FieldDescription>
                                    Must be at least 8 characters with uppercase, lowercase, and number
                                </FieldDescription>
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
