import mongoose, { Schema, Document } from "mongoose";
import { Snippet, SnippetSchema } from "./Snippet";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    snippets: Snippet[];
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: string,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: string,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Please enter a valid email address",
        ],
    },
    password: {
        type: string,
        required: [true, "Password is required"]
    },
    snippets: [SnippetSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema));

export default UserModel;
