"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
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

    //Credentials sign-in handler
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            redirect: true,
            callbackUrl: "/dashboard",
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
    };

    //Google sign-in handler
    const handleOAuthSignIn = (provider: string) => {
        signIn(provider, { callbackUrl: "/dashboard" });
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
                            Enter your credentials to access your saved
                            snippets.
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

                        <div className="relative w-full my-1 flex items-center justify-center">
                            <div className="border-t border-gray-300 w-full" />
                            <span className="bg-white px-2 text-xs text-gray-500 uppercase absolute">
                                Or
                            </span>
                        </div>

                        <div className="w-full md:w-fit flex flex-col md:flex-row justify-center items-center gap-2 md:gap-1">
                            {/* Google Sign-In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuthSignIn("google")}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                <span className="md:hidden">Sign In with Google</span>
                            </Button>

                            {/* GitHub Sign-In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuthSignIn("github")}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                                <span className="md:hidden">Sign In with GitHub</span>
                            </Button>

                            {/* Apple Sign-In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOAuthSignIn("apple")}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <svg
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.64-.78 1.08-1.85.96-2.93-.93.04-2.07.62-2.74 1.4-.6.7-.1.13-1.13 1.83-1.02 2.94.94.04 2.11-.57 2.8-1.41z" />
                                </svg>
                                <span className="md:hidden">Sign In with Apple</span>
                            </Button>
                        </div>

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
