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
import { ThreadValidation } from "@/lib/validations/thread";
import { z } from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";
import Loader from "../ui/Loader";

interface IProps {
  userId: string;
}

const PostThread: FC<IProps> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    try {
      setIsLoading(true);

      await createThread({
        text: values.thread,
        author: userId,
        path: pathname,
        communityId: organization ? organization.id : null,
      });

      router.push("/");
    } catch (error: any) {
      throw new Error(`Error creating thread: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 flex flex-col justify-start gap-10 md:mt-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          {isLoading ? <Loader /> : "Post Thread"}
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
