import { z } from "zod";

export const snippetSchema = z.object({
    title: z
        .string()
        .trim()
        .transform((val) => (val === "" ? "Untitled Snippet" : val))
        .optional(),
    content: z.string().min(2, "Snippet content is required"),
    language: z.string().optional(),
    burnAfterRead: z.boolean().optional(),
    expirationHours: z.coerce.number().optional(),
});
