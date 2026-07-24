import { z } from "zod";

export const snippetSchema = z.object({
    title: z.string().trim().optional(),
    content: z.string(),
    language: z.string().optional(),
    burnAfterRead: z.boolean().optional(),
    expiresAt: z.number().optional(),
});
