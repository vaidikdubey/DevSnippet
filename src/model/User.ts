import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    snippets: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<User> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
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
        type: String,
        required: [true, "Password is required"],
    },
    snippets: [
        {
            type: Schema.Types.ObjectId,
            ref: "Snippet",
        },
    ],
});

const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;
