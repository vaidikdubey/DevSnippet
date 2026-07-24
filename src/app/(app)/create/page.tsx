"use client";

import { toast } from "@/components/ui/toast";
import { snippetSchema } from "@/schemas/snippetSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupTextarea } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const CreateSnippet = () => {
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof snippetSchema>>({
        resolver: zodResolver(snippetSchema),
        defaultValues: {
            title: "",
            content: "",
            language: "",
            burnAfterRead: false,
            expiresAt: 0,
        },
    });

    const onSubmit = async (data: z.infer<typeof snippetSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/snippets", data);

            toast.add({
                title: "Success",
                description: response.data.message || "Snippet created",
                type: "success",
            });

            router.replace("/dashboard");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast.add({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Error creating snippet",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-full w-full flex justify-center items-center overflow-y-auto py-8 px-4">
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>New Snippet</CardTitle>
                    <CardDescription>
                        Enter your snippet details here to create a new snippet.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        id="snippet-form"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FieldGroup>
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="snippet-form-title">
                                            Title
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="snippet-form-title"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="REST API Response Snippet"
                                            autoComplete="off"
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
                                name="content"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="snippet-form-description">
                                            Snippet
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="snippet-form-description"
                                                placeholder="export class ApiResponse {}"
                                                className="min-h-24"
                                                style={{
                                                    fieldSizing: "content",
                                                }}
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                        </InputGroup>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="language"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="snippet-form-language">
                                            Language
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="snippet-form-language"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="JavaScript"
                                            autoComplete="off"
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
                                name="burnAfterRead"
                                control={form.control}
                                render={({ field }) => (
                                    <Field>
                                        <Label htmlFor="snippet-form-burn">
                                            Burn After Read
                                        </Label>
                                        <Switch
                                            id="snippet-form-burn"
                                            checked={field.value}
                                            onCheckedChange={(checked) =>
                                                field.onChange(checked)
                                            }
                                        />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="expiresAt"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="snippet-form-expires">
                                            Expires At
                                        </FieldLabel>
                                        <Input
                                            type="number"
                                            {...field}
                                            id="snippet-form-expires"
                                            aria-invalid={fieldState.invalid}
                                        />
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
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                        >
                            Reset Template
                        </Button>
                        <Button
                            type="submit"
                            form="snippet-form"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Creating Snippet..."
                                : "Create Snippet"}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
    );
};
export default CreateSnippet;
