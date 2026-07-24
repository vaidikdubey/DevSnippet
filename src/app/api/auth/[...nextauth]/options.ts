import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        email: credentials?.email,
                    });

                    if (!user) throw new Error("User not found");

                    const enteredPassword = credentials?.password || "";
                    const isPasswordCorrect = await bcrypt.compare(
                        enteredPassword,
                        user.password,
                    );

                    if (isPasswordCorrect) {
                        return {
                            id: user._id.toString(),
                            name: user.name,
                            email: user.email,
                        };
                    } else throw new Error("Invalid credentials");
                } catch (error) {
                    throw new Error(
                        error instanceof Error ? error.message : "Auth failed",
                    );
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) { 
                token._id = user.id
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token._id) { 
                session.user.id = token._id as string
            }
            return session;
        },
    },

    pages: {
        signIn: "/sign-in",
    },

    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,
};
