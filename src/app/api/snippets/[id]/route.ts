//GET by ID, PATCH for update by ID

import dbConnect from "@/lib/dbConnect";
import SnippetModel, { Snippet } from "@/model/Snippet";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> },
): Promise<Response> {
    const id = (await context.params).id;

    await dbConnect();

    const snippetId = new mongoose.Types.ObjectId(id);

    try {
        const { searchParams } = new URL(request.url);
        const burn: boolean = searchParams.get("burn") !== "false";

        const snippet = await SnippetModel.findById(snippetId);

        if (!snippet)
            return Response.json(
                {
                    success: false,
                    message: "Snippet not found or expired",
                },
                { status: 404 },
            );

        //If burn after read is enabled and the request is not for update route delete the snippet. We can safely delete as we already have a local copy for response in snippet variable.
        if (burn && snippet.burnAfterRead) {
            await SnippetModel.findByIdAndDelete(snippetId);
        }

        return Response.json(
            {
                success: true,
                message: "Snippet found",
                snippet,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error getting snippet", error);
        return Response.json(
            {
                success: false,
                message: "Error getting snippet",
            },
            { status: 500 },
        );
    }
}

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> },
): Promise<Response> {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    const userId = new mongoose.Types.ObjectId(user.id);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 },
        );
    }

    const id = (await context.params).id;
    const snippetId = new mongoose.Types.ObjectId(id);

    try {
        const snippet = await SnippetModel.findById(snippetId);

        if (!snippet)
            return Response.json(
                {
                    success: false,
                    message: "Snippet not found or expired",
                },
                { status: 404 },
            );

        //Cannot directly use !== beacuse MongoDB objectIds become objects in JS/TS and strict eqaulity check needs same reference for objects to be "true", so === will always be "false"
        if (!snippet.userId.equals(userId))
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 403 },
            );

        const { title, content, language, burnAfterRead, expirationHours } =
            await request.json();

        if (!content || !content.trim() || typeof content != "string")
            return Response.json(
                {
                    success: false,
                    message: "Content is required and cannot be empty",
                },
                { status: 400 },
            );

        const data: Partial<Snippet> = {};

        data.content = content;

        if (title) data.title = title;
        if (language) data.language = language;
        if (burnAfterRead !== undefined)
            data.burnAfterRead = Boolean(burnAfterRead);
        if (expirationHours && expirationHours > 0)
            data.expiresAt = new Date(
                Date.now() + expirationHours * 60 * 60 * 1000,
            );

        const updatedSnippet = await SnippetModel.findByIdAndUpdate(
            snippetId,
            data,
            { new: true, runValidators: true },
        );

        return Response.json(
            {
                success: true,
                message: "Snippet updated",
                updatedSnippet,
            },
            { status: 200 },
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
