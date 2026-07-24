"use client";

import { toast } from "@/components/ui/toast";
import { Snippet } from "@/model/Snippet";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

const DashboardPage = () => {
    const [isGettingSnippets, setIsGettingSnippets] = useState(false);
    const [snippets, setSnippets] = useState<Snippet[]>([]);

    const { data: session } = useSession();

    const fetchSnippets = useCallback(
        async (refresh: boolean = false) => {
            setIsGettingSnippets(true);

            try {
                const response = await axios.get<ApiResponse>("/api/snippets");

                setSnippets(response.data.snippets || []);

                if (refresh) {
                    toast.add({
                        title: "Refreshed",
                        description: "Showing latest snippets",
                        type: "success",
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;

                toast.add({
                    title: "Error",
                    description:
                        axiosError.response?.data.message ||
                        "Failed to refresh snippets",
                    type: "error",
                });
            } finally {
                setIsGettingSnippets(false);
            }
        },
        [setSnippets, setIsGettingSnippets],
    );

    useEffect(() => {
        if (!session || !session.user) return;

        fetchSnippets();
    }, [session, fetchSnippets]);

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center min-h-50">
                <p className="text-muted-foreground">
                    Please sign in to view your snippets.
                </p>
            </div>
        );
    }

    return <div></div>;
};
export default DashboardPage;
