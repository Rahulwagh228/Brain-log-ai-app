import {z} from "zod";

export const createNoteSchema = z.object({
    title: z.string().min(1, {message: "Title is Required"}),
    content: z.string().optional(),
})

export type createNoteSchema = z.infer<typeof createNoteSchema>;