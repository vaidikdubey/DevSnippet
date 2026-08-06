import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_OAUTH_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || "",
        }),
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
        async signIn({ account, profile }) {
            if (account?.provider !== "credentials") {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        email: profile?.email,
                    });

                    //If new user, we redirect them to sign-up page
                    if (!user) {
                        return `/sign-up`;
                    }

                    return true;
                } catch (error) {
                    console.error("Error signing in user with google", error);
                    return false;
                }
            }

            return true;
        },

        async jwt({ token, user, account }) {
            if (user) {
                //If user sign-in is through google we find _id and attach in token
                if (account?.provider !== "credentials") {
                    await dbConnect();
                    const dbUser = await UserModel.findOne({
                        email: user.email,
                    });

                    if (dbUser) token._id = dbUser._id.toString();
                } else {
                    token._id = user.id;
                }
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user && token._id) {
                session.user.id = token._id as string;
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
