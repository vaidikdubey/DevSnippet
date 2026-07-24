"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

//Shadcn components
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";

const Page = () => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    //Not using traditional method here since sign-in uses nextauth
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        if (result?.error) {
            if (result.error == "CredentialsSignin") {
                toast.add({
                    title: "Error",
                    description: "Invalid credentials",
                    type: "error",
                });
            } else {
                toast.add({
                    title: "Error",
                    description: result.error,
                    type: "error",
                });
            }
        }

        setIsSubmitting(false);
        if (result?.ok) {
            router.replace("/dashboard");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-6">
                        Welcome Back <span className="text-blue-600">Dev</span>
                    </h1>
                </div>

                {/* Signin Form */}
                <Card className="w-full sm:max-w-md tracking-tight">
                    <CardHeader>
                        <CardTitle>Access your account</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your saved snippets.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="signin-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signin-form-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="signin-form-email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="Your Registered Email"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signin-form-password">
                                                Password
                                            </FieldLabel>
                                            <div className="flex justify-center items-center gap-1">
                                                <Input
                                                    type={
                                                        passwordVisible
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    {...field}
                                                    id="signup-form-password"
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Strong Password"
                                                />{" "}
                                                {passwordVisible ? (
                                                    <EyeOff
                                                        onClick={() =>
                                                            setPasswordVisible(
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        onClick={() =>
                                                            setPasswordVisible(
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                            {fieldState.invalid && (
                                                <FieldError
                                                    errors={[fieldState.error]}
                                                />
                                            )}
                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Field orientation="responsive">
                            <Button
                                type="submit"
                                form="signin-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {" "}
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Fetching your snippets{" "}
                                    </>
                                ) : (
                                    "Access Snippets"
                                )}
                            </Button>
                        </Field>

                        <div>
                            <p>
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Page;
