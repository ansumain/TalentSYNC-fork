import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
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
import { Link } from "react-router-dom";

export function ResetPassword({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Reset Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Enter New Password</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">OTP</FieldLabel>
                                <Input
                                    id="otp"
                                    type="number"
                                    required
                                />
                            </Field>
                            <Field>
                                <Link to="/signin">
                                    <Button type="submit">Submit</Button>
                                </Link>
                                <FieldDescription className="text-center">
                                    Remember Password?{" "}
                                    <Link to="/signin">Sign In</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
