"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { addLikeToThread } from "@/lib/actions/thread.actions";
import { ObjectId } from "mongoose";

interface Props {
  threadId: string;
  authorId: ObjectId;
  likes: ObjectId[];
}

function LikeThread({ threadId, authorId, likes }: Props) {
  const pathname = usePathname();

  const handleLikeThread = async () => {
    await addLikeToThread({
      threadId,
      userId: authorId,
      path: pathname,
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Image
        src={
          likes.includes(authorId)
            ? "/assets/heart-filled.svg"
            : "/assets/heart-gray.svg"
        }
        alt="Heart"
        width={24}
        height={24}
        onClick={handleLikeThread}
        className="cursor-pointer object-contain"
      />

      {likes.length > 0 && (
        <p className="text-subtle-medium text-gray-1">{likes.length}</p>
      )}
    </div>
  );
}

export default LikeThread;
