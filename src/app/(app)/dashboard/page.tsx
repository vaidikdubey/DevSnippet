"use client";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Snippet } from "@/model/Snippet";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <div className="w-full flex items-center justify-between">
                <h1 className="text-4xl font-bold mb-4">Snippets</h1>

                <Button className="text-xl cursor-pointer" variant="default">
                    <Link href={"/create"}>Create Snippet</Link>
                </Button>
            </div>

            <div
                className={cn(
                    "mt-4",
                    snippets.length > 0
                        ? `grid grid-cols-1 md:grid-cols-2 gap-6`
                        : `h-full w-full flex justify-center items-center`,
                )}
            >
                {snippets.length > 0 ? (
                    snippets.map((snippet) => (
                        <Card
                            key={snippet._id.toString()}
                            className="w-full max-w-xs"
                        >
                            <CardHeader>
                                {isGettingSnippets && (
                                    <>
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </>
                                )}
                            </CardHeader>
                            <CardContent>
                                {isGettingSnippets && (
                                    <Skeleton className="aspect-video w-full" />
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-2xl">No Snippets found.</p>
                )}
            </div>
        </div>
    );
};
export default DashboardPage;
