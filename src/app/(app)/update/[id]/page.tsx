'use client'

import { useParams, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { snippetSchema } from "@/schemas/snippetSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@monaco-editor/react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const UpdatePage = () => {
    const id = useParams<{ id: string }>().id;

    const burn = useSearchParams().get("burn") !== "false"

    

      const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [language, setLanguage] = useState("plaintext");

    const form = useForm<z.input<typeof snippetSchema>>({
        resolver: zodResolver(snippetSchema),
        defaultValues: {
            title: "",
            content: "",
            language: "",
            burnAfterRead: false,
            expirationHours: 0,
        },
    });

    const onSubmit = async (data: z.input<typeof snippetSchema>) => {
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
        <div className="h-full w-full flex flex-col justify-center overflow-y-hidden items-center py-8 px-4">
            <h1 className="text-2xl md:text-3xl my-2 underline underline-offset-4 font-bold">
                Create New Snippet
            </h1>
            <form
                className="h-full w-full"
                id="snippet-form"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="h-full w-full flex">
                    <div className="h-full w-full flex flex-col text-xl gap-2 font-medium">
                        <div className="w-full flex justify-between items-center flex-wrap gap-2">
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="snippet-form-title">
                                            Title:
                                        </Label>
                                        <Input
                                            {...field}
                                            id="snippet-form-title"
                                            aria-invalid={fieldState.invalid}
                                            type="text"
                                            placeholder="Untitled Snippet"
                                        />
                                    </div>
                                )}
                            />
                            <Controller
                                name="language"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="flex gap-2 justify-end items-center">
                                        <Label htmlFor="snippet-form-language">
                                            Language:{" "}
                                        </Label>
                                        <Input
                                            className="w-full"
                                            {...field}
                                            id="snippet-form-language"
                                            aria-invalid={fieldState.invalid}
                                            type="text"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                setLanguage(e.target.value);
                                            }}
                                            placeholder="cpp/csharp (use lowercase)"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                        <Controller
                            name="content"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div className="h-full max-h-100 lg:max-h-125 w-full">
                                    <Editor
                                        {...field}
                                        height="100%"
                                        width="100%"
                                        defaultLanguage={language
                                            .toLowerCase()
                                            .trim()}
                                        onChange={(e) => {
                                            field.onChange(e);
                                        }}
                                        language={language.toLowerCase().trim()}
                                        options={{
                                            automaticLayout: true,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </div>
                            )}
                        />
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <Controller
                                name="burnAfterRead"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="flex items-center gap-2">
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
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </div>
                                )}
                            />
                            <Controller
                                name="expirationHours"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <div className="flex items-center gap-2">
                                        <Label
                                            htmlFor="snippet-form-expiry"
                                            className="w-fit"
                                        >
                                            Expiry (hours):
                                        </Label>
                                        <Input
                                            {...field}
                                            value={(field.value as number | string) ?? ""}
                                            id="snippet-form-expiry"
                                            aria-invalid={fieldState.invalid}
                                            type="number"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>
            <div className="w-full flex justify-center items-center my-4 gap-2">
                <Button
                    type="reset"
                    form="snippet-form"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                    variant="outline"
                >
                    Reset <RefreshCcw />
                </Button>
                <Button
                    type="submit"
                    form="snippet-form"
                    disabled={isSubmitting}
                >
                    Create Snippet
                </Button>
            </div>
        </div>
    );
}
export default UpdatePage
