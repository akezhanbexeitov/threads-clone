"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";

interface Props {
  threadId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteThread({
  threadId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  const handleDeleteThread = async () => {
    await deleteThread(JSON.parse(threadId), pathname);
    if (!parentId || !isComment) {
      router.push("/");
    }
  };

  return (
    <div className="flex h-6 w-6 cursor-pointer items-center justify-center">
      <Image
        src="/assets/delete.svg"
        alt="delete thread"
        width={18}
        height={18}
        onClick={handleDeleteThread}
      />
    </div>
  );
}

export default DeleteThread;
