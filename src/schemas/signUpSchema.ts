import { z } from "zod";

export const signUpSchema = z
    .object({
        name: z
            .string()
            .min(2, { message: "Name must be atleast 2 characters" }),
        email: z.email("Enter a valid email").toLowerCase(),
        password: z
            .string()
            .min(8, { message: "Password must be atleast 8 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords do not match",
        path: ["confirmPassword"],
    });
