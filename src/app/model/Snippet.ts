import mongoose, { Schema, Document } from "mongoose";

export interface Snippet extends Document {
    userId: mongoose.Types.ObjectId; 
    title: string;
    content: string;
    language: string;
    burnAfterRead: boolean;
    expiresAt?: Date
}


export const SnippetSchema: Schema<Snippet> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        default: "Untitled Snippet"
    },
    content: {
        type: String,
        required: [true, "Content is required and cannot be empty"],
    },
    language: {
        type: String,
        default: "plaintext"
    },
    burnAfterRead: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        expires: 0
    }
}, { timestamps: true })

const SnippetModel = (mongoose.models.Snippet as mongoose.Model<Snippet>) || (mongoose.model<Snippet>("Snippet", SnippetSchema));

export default SnippetModel;