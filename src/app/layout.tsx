import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Roboto_Slab } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import AuthProvider from "@/context/AuthProvider";

const robotoSlabHeading = Roboto_Slab({
    subsets: ["latin"],
    variable: "--font-heading",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "DevSnippet",
    description: "Create and manage your code snippets",
    icons: {
        icon: "favicon.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-sans",
                inter.variable,
                robotoSlabHeading.variable,
            )}
        >
            <AuthProvider>
                <body className="min-h-full flex flex-col">
                    {children} <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
