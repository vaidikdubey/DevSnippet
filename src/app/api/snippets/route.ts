//GET (for user snippets) and POST (create new snippets)

import dbConnect from "@/app/lib/dbConnect";
import UserModel from "@/app/model/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import SnippetModel from "@/app/model/Snippet";

export async function GET(request: Request): Promise<Response> {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 },
        );
    }

    const userId = new mongoose.Types.ObjectId(user.id);

    try {
        const user = await UserModel.findById(userId);

        if (!user)
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 },
            );

        return Response.json({
            success: true,
            message:
                user.snippets.length > 0
                    ? "User snippets found"
                    : "No snippets found",
            snippets: user.snippets,
        });
    } catch (error) {
        console.error("Error getting snippets", error);
        return Response.json(
            {
                success: false,
                message: "Error getting snippets",
            },
            { status: 500 },
        );
    }
}

export async function POST(request: Request): Promise<Response> {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 },
        );
    }

    const userId = new mongoose.Types.ObjectId(user.id);

    try {
        const { title, content, language, burnAfterRead, expirationHours } =
            await request.json();

        if (!content)
            return Response.json(
                {
                    success: false,
                    message: "Content is required and cannot be empty",
                },
                { status: 400 },
            );

        let expiresAt: Date | null = null;

        if (expirationHours && expirationHours > 0) {
            expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
        }

        const newSnippet = new SnippetModel({
            userId,
            title,
            content,
            language,
            burnAfterRead,
            expiresAt,
        });

        await newSnippet.save();

        return Response.json(
            {
                success: true,
                message: "Snippet created",
                newSnippet,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating snippet", error);
        return Response.json(
            {
                success: false,
                message: "Error creating snippet",
            },
            { status: 500 },
        );
    }
}
