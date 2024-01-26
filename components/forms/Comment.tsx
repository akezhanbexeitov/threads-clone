"use client";

import { FC, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/thread";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import Loader from "../ui/Loader";

interface IProps {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment: FC<IProps> = ({ threadId, currentUserImage, currentUserId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    try {
      setIsLoading(true);

      await addCommentToThread({
        threadId,
        commentText: values.thread,
        userId: JSON.parse(currentUserId),
        path: pathname,
      });

      form.reset();
    } catch (error: any) {
      throw new Error(`Error adding comment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel className="h-12 w-12 overflow-hidden rounded-full">
                <Image
                  src={currentUserImage}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </FormLabel>
              <div className="flex w-full flex-col">
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus text-light-1 outline-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="px-3 py-2" />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          {isLoading ? <Loader /> : "Reply"}
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
