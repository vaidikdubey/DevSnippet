import { z } from "zod";

export const signUpSchema = z.object({
    email: z.email(),
    password: z
        .string()
        .min(8, { message: "Password must be atleast 8 characters" }),
});
