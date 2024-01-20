import { fetchUserThreads } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { FC } from "react";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityThreads } from "@/lib/actions/community.actions";

interface IProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab: FC<IProps> = async ({
  currentUserId,
  accountId,
  accountType,
}) => {
  let threads: any;

  if (accountType === "Community") {
    threads = await fetchCommunityThreads(accountId);
  } else {
    threads = await fetchUserThreads(accountId);
  }

  if (!threads) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {threads.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? { name: threads.name, image: threads.image, id: threads.id }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
