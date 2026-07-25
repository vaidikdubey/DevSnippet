"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Code2 } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800">
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-16">
                {/* Hero Section */}
                <section className="text-center flex flex-col items-center gap-6 max-w-3xl mx-auto pt-6">
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        <span className="text-blue-600 font-extrabold block sm:inline">
                            DevSnippet
                        </span>{" "}
                        - Share Code Safely. Set Expiration. Burn on Read.
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                        The simplest way to share{" "}
                        <strong className="text-slate-900">
                            code snippets
                        </strong>
                        , <strong className="text-slate-900">API keys</strong>,
                        and <strong className="text-slate-900">logs</strong>.
                        Fast, secure, and{" "}
                        <strong className="text-slate-900">
                            automatically self-destructs
                        </strong>{" "}
                        on your schedule.
                    </p>

                    <div className="pt-2">
                        <Button
                            size="lg"
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 text-base px-8 py-6 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="flex flex-col gap-8">
                    <div className="text-center">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Built for Fast, Secure Sharing
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-slate-300 transition">
                            <div className="p-2.5 w-fit rounded-lg bg-red-50 text-red-600">
                                <Flame className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Burn After Reading
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Set your snippet to self-destruct the moment
                                it&apos;s opened. Perfect for sending temporary
                                credentials or secrets.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-slate-300 transition">
                            <div className="p-2.5 w-fit rounded-lg bg-amber-50 text-amber-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Custom Expirations
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Choose when your code expires - from a few hours
                                to several days. Once time runs out, it&apos;s
                                purged forever.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 hover:border-slate-300 transition">
                            <div className="p-2.5 w-fit rounded-lg bg-blue-50 text-blue-600">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                Syntax Highlighting
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Full support for dozens of languages with clean,
                                developer-friendly Monaco editor formatting out
                                of the box.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Banner Section */}
                <section className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center gap-4 shadow-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                        Ready to share code without leaving a paper trail?
                    </h2>
                    <p className="text-slate-300 max-w-xl text-sm sm:text-base">
                        No setup required. Create easy, single-use code snippets
                        in seconds.
                    </p>
                    <Button
                        size="lg"
                        className="bg-white text-slate-900 hover:bg-slate-100 mt-2 font-semibold"
                    >
                        <Link href="/sign-in">Sign In to Create Snippet</Link>
                    </Button>
                </section>
            </main>

            {/* Footer */}
            <footer className="text-center p-6 border-t border-slate-200 bg-white text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} DevSnippet. All rights
                reserved.
            </footer>
        </div>
    );
}
