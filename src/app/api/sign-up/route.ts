import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password } = await request.json();

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists with this email",
                },
                { status: 400 },
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return Response.json(
            {
                success: true,
                message: "User registered",
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 },
        );
    }
}
