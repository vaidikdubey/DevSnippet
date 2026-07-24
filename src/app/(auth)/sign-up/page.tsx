"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

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
import { Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";

const Page = () => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    //zod implementation

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>(
                "/api/sign-up",
                data,
            );

            if (response.data.success) {
                toast.add({
                    title: "Success",
                    description: response.data.message,
                    type: "success",
                });

                router.replace(`/dashboard`);
            }
        } catch (error) {
            console.error("Error in signup of user", error);

            const axiosError = error as AxiosError<ApiResponse>;

            const errorMessage =
                axiosError.response?.data.message || "Error in signup";

            toast.add({
                title: "Error",
                description: errorMessage,
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join DevSnippet
                    </h1>
                </div>

                {/* Signup Form */}
                <Card className="w-full sm:max-w-md tracking-tight">
                    <CardHeader>
                        <CardTitle>Create your account</CardTitle>
                        <CardDescription>
                            Save and manage your snippets & prompts effortlessly
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="signup-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FieldGroup>
                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-name">
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="signup-form-name"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="John Doe"
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
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="signup-form-email"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                                placeholder="john.doe@example.com"
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
                                            <FieldLabel htmlFor="signup-form-password">
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
                                <Controller
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldLabel htmlFor="signup-form-confirm-password">
                                                Confirm Password
                                            </FieldLabel>
                                            <div className="flex justify-center items-center gap-1">
                                                <Input
                                                    type={
                                                        confirmPasswordVisible
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    {...field}
                                                    id="signup-form-confirm-password"
                                                    aria-invalid={
                                                        fieldState.invalid
                                                    }
                                                    placeholder="Repeat Your Password"
                                                />{" "}
                                                {confirmPasswordVisible ? (
                                                    <EyeOff
                                                        onClick={() =>
                                                            setConfirmPasswordVisible(
                                                                (prev) => !prev,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <Eye
                                                        onClick={() =>
                                                            setConfirmPasswordVisible(
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
                                form="signup-form"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        {" "}
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                        Setting things up{" "}
                                    </>
                                ) : (
                                    <>
                                        Get Started <ArrowRight />
                                    </>
                                )}
                            </Button>
                        </Field>

                        <div>
                            <p>
                                Already a member?{" "}
                                <Link
                                    href="/sign-in"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Sign In
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
