import * as z from "zod";

export const ThreadValidation = z.object({
    thread: z.string().nonempty({ message: "Thread content cannot be empty" }).min(3, { message: "Minimum 3 characters" }),
    accountId: z.string()
});

export const CommentValidation = z.object({
    thread: z.string().nonempty({ message: "Comment content cannot be empty" }).min(3, { message: "Minimum 3 characters." }),
});
