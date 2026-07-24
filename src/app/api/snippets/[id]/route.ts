//GET by ID

import dbConnect from "@/app/lib/dbConnect";
import SnippetModel from "@/app/model/Snippet";
import mongoose from "mongoose";

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> },
): Promise<Response> {
    const id = (await context.params).id;

    await dbConnect();

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

        //If burn after read is enabled delete the snippet. We can safely delete as we already have a local copy for response in snippet variable.
        if (snippet.burnAfterRead) {
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
