"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { addLikeToThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongoose";

interface Props {
  threadId: string;
  authorId: ObjectId;
}

function LikeThread({ threadId, authorId }: Props) {
  const pathname = usePathname();

  console.log("threadId", threadId);
  console.log("authorId", authorId);

  const handleLikeThread = async () => {
    await addLikeToThread({
      threadId,
      userId: authorId,
      path: pathname,
    });
  };

  return (
    <Image
      src="/assets/heart-gray.svg"
      alt="Heart"
      width={24}
      height={24}
      onClick={handleLikeThread}
      className="cursor-pointer object-contain"
    />
  );
}

export default LikeThread;
