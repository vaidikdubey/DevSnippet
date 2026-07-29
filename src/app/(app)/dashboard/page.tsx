"use client";

import { toast } from "@/components/ui/toast";
import mongoose from "mongoose";
import { cn } from "@/lib/utils";
import { Snippet } from "@/model/Snippet";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Copy, Flame, Leaf, Loader2, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DashboardPage = () => {
    const router = useRouter();

    const [isGettingSnippets, setIsGettingSnippets] = useState<boolean>(false);
    const [isDeletingSnippet, setIsDeletingSnippet] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [snippets, setSnippets] = useState<
        (Snippet & { createdAt?: Date })[]
    >([]);

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

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined"
            ? `${window?.location.protocol}//${window?.location.host}`
            : "");

    const copyToClipboard = (id: string) => {
        if (!id) return;

        navigator.clipboard.writeText(`${baseUrl}/snippet/${id}`);

        toast.add({
            title: "Success",
            description: "Snippet URL Copied",
            type: "success",
        });
    };

    const handleSnippetDelete = async (
        id: string | mongoose.Types.ObjectId,
    ) => {
        if (!id) {
            toast.add({
                title: "Error",
                description: "Invalid or missing snippet ID",
                type: "error",
            });

            return;
        }

        setIsDeletingSnippet(true);

        try {
            const response = await axios.delete(`/api/snippets/${id}`);

            toast.add({
                title: "Success",
                description: response.data.message || "Snippet deleted",
                type: "success",
            });
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
            setIsDeletingSnippet(false);
            router.refresh();
            setOpen(false);
        }
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <div className="w-full flex items-center justify-between flex-wrap">
                <h1 className="text-4xl font-bold mb-4">Snippets</h1>

                <Button className="text-xl cursor-pointer" variant="default">
                    <Link href={"/create"}>Create Snippet</Link>
                </Button>
            </div>
            <div
                className={cn(
                    "mt-4",
                    snippets.length > 0
                        ? `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`
                        : `h-full w-full flex justify-center items-center`,
                )}
            >
                {snippets.length > 0 ? (
                    snippets.map((snippet) => (
                        <Card
                            key={snippet._id.toString()}
                            className="w-full flex flex-col justify-between overflow-hidden"
                        >
                            <CardHeader className="text-3xl font-bold underline underline-offset-4">
                                {isGettingSnippets ? (
                                    <>
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </>
                                ) : (
                                    <Link
                                        href={`/update/${snippet._id}?burn=false`}
                                        className="block w-full min-w-0 truncate"
                                    >
                                        {snippet.title}
                                    </Link>
                                )}
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-3">
                                {isGettingSnippets ? (
                                    <Skeleton className="aspect-video w-full" />
                                ) : (
                                    <div className="line-clamp-5">
                                        {snippet.content}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    {isGettingSnippets ? (
                                        <Skeleton className="h-4 w-1/3" />
                                    ) : (
                                        <span className="font-medium">
                                            Language:{" "}
                                            {snippet.language.toLocaleUpperCase()}
                                        </span>
                                    )}

                                    {isGettingSnippets ? (
                                        <Skeleton className="h-4 w-1/3" />
                                    ) : (
                                        snippet.burnAfterRead && (
                                            <span className="flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                                                <Flame className="w-3.5 h-3.5" />{" "}
                                                Burn
                                            </span>
                                        )
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col justify-between items-start gap-1 rounded-b-none">
                                {isGettingSnippets ? (
                                    <Skeleton className="h-4 w-1/3" />
                                ) : (
                                    <span>
                                        <span className="font-medium">
                                            Created:
                                        </span>{" "}
                                        {snippet.createdAt
                                            ? new Date(
                                                  snippet.createdAt,
                                              ).toLocaleString(undefined, {
                                                  dateStyle: "short",
                                                  timeStyle: "short",
                                              })
                                            : "-"}
                                    </span>
                                )}
                                {isGettingSnippets ? (
                                    <Skeleton className="h-4 w-1/3" />
                                ) : (
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium">
                                            Expiry:
                                        </span>{" "}
                                        {snippet.expiresAt ? (
                                            new Date(
                                                snippet.expiresAt,
                                            ).toLocaleString(undefined, {
                                                dateStyle: "short",
                                                timeStyle: "short",
                                            })
                                        ) : (
                                            <span className="w-fit flex justify-center items-center gap-2 text-green-400">
                                                Non expiring{" "}
                                                <Leaf size={15} />{" "}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </CardFooter>
                            <div>
                                <Button
                                    onClick={() =>
                                        copyToClipboard(snippet._id.toString())
                                    }
                                    className="w-full rounded-none border-b-0"
                                    variant="outline"
                                >
                                    Copy Link
                                    <Copy />
                                </Button>
                                <AlertDialog open={open} onOpenChange={setOpen}>
                                    <AlertDialogTrigger
                                        render={
                                            <Button
                                                className="w-full rounded-none border-x-0 border-b-0"
                                                variant="destructive"
                                                disabled={isDeletingSnippet}
                                            >
                                                Delete Snippet <Trash2 />
                                            </Button>
                                        }
                                    />
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you absolutely sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone.
                                                This will permanently delete{" "}
                                                <span className="font-bold">
                                                    &ldquo;{snippet.title}
                                                    &rdquo;
                                                </span>{" "}
                                                snippet from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel
                                                disabled={isDeletingSnippet}
                                            >
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                disabled={isDeletingSnippet}
                                                onClick={() =>
                                                    handleSnippetDelete(
                                                        snippet._id,
                                                    )
                                                }
                                                variant="destructive"
                                            >
                                                {isDeletingSnippet ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Deleting{" "}
                                                    </>
                                                ) : (
                                                    "Delete"
                                                )}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
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
