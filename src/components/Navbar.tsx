"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

const Navbar = () => {
    const { data: session } = useSession();

    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-stone-700 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a
                    href="#"
                    className="text-xl font-bold mb-4 md:mb-0 hover:text-primary"
                >
                    DevSnippet
                </a>

                {session ? (
                    <>
                        <span className="mr-4">
                            Welcome,{" "}
                            <span className="font-bold capitalize underline underline-offset-4 hover:text-secondary">
                                {user?.name || "User"}
                            </span>
                        </span>
                        <Button
                            onClick={() => signOut()}
                            className="w-full md:w-auto bg-slate-100 text-black"
                            variant="outline"
                        >
                            Logout
                        </Button>
                    </>
                ) : (
                    <Button
                        className="w-full md:w-auto bg-slate-100 text-black"
                        variant="outline"
                    >
                        <Link href="/sign-in">Login</Link>
                    </Button>
                )}
            </div>
        </nav>
    );
};
export default Navbar;
