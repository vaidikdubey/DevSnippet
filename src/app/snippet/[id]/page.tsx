"use client";

import { toast } from "@/components/ui/toast";
import { Snippet } from "@/model/Snippet";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Loader2, Flame, Clock } from "lucide-react";

const ViewSnippetPage = () => {
    const params = useParams<{ id: string }>();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [snippetNotFound, setSnippetNotFound] = useState<boolean>(false);

    const [snippet, setSnippet] = useState<Partial<Snippet>>({
        title: "",
        content: "",
        language: "plaintext",
        burnAfterRead: false,
        expiresAt: new Date(0),
    });

    const fetchSnippet = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await axios.get(`/api/snippets/${params.id}`);

            const fetchedSnippet = response.data.snippet;

            setSnippet({
                ...fetchedSnippet,
                expiresAt: fetchedSnippet.expiresAt
                    ? new Date(fetchedSnippet.expiresAt)
                    : new Date(0),
            });

            toast.add({
                title: "Success",
                description: response.data.message || "Snippet found",
                type: "success",
            });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            setSnippetNotFound(true);

            toast.add({
                title: "Error",
                description:
                    axiosError.response?.data.message ||
                    "Error fetching snippet",
                type: "error",
            });
        } finally {
            setIsLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        fetchSnippet();
    }, [fetchSnippet]);

    if (isLoading) {
        return (
            <div className="h-full w-full flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (snippetNotFound) {
        return (
            <div className="h-full w-full flex flex-col gap-2 justify-center items-center md:py-20 text-center">
                <h1 className="text-4xl">Poof! It&apos;s Gone....</h1>
                <p className="text-xl">
                    This snippet might have expired, self-destructed after
                    reading, or the link is incorrect.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col justify-center overflow-y-hidden items-center py-8 px-4">
            <div className="h-full w-full flex flex-col text-xl gap-4 font-medium">
                <div className="w-full flex justify-between items-center flex-wrap gap-4 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {snippet.title || "Untitled Snippet"}
                        </h1>
                        {snippet.burnAfterRead && (
                            <span className="flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                                <Flame className="w-3.5 h-3.5" /> Burn After
                                Read
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md font-mono uppercase">
                            {snippet.language || "plaintext"}
                        </span>
                    </div>
                </div>

                {/* Monaco Editor (Read Only) */}
                <div className="h-full min-h-100 max-h-100 lg:max-h-125 w-full border rounded-md overflow-hidden my-2">
                    <Editor
                        height="100%"
                        width="100%"
                        language={
                            snippet.language?.toLowerCase().trim() ||
                            "plaintext"
                        }
                        value={snippet.content || ""}
                        options={{
                            readOnly: true,
                            domReadOnly: true,
                            automaticLayout: true,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                        }}
                    />
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
                    {snippet.expiresAt && snippet.expiresAt.getTime() > 0 ? (
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>
                                Expires: {snippet.expiresAt.toLocaleString()}
                            </span>
                        </div>
                    ) : snippet.burnAfterRead ? (
                        <span>One Time View</span>
                    ) : (
                        <span>No Expiration</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSnippetPage;
