import { Snippet } from "../model/Snippet";

export interface ApiResponse {
    success: boolean;
    message: string;
    name?: string;
    snippets?: Array<Snippet>;
}
