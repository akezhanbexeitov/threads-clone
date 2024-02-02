"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  addLikeToThread,
  removeLikeFromThread,
} from "@/lib/actions/thread.actions";
import { ObjectId } from "mongoose";
import { useState } from "react";

interface Props {
  threadId: string;
  authorId: ObjectId;
  likes: ObjectId[];
}

function LikeThread({ threadId, authorId, likes }: Props) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pathname = usePathname();

  const handleThreadDislike = async () => {
    try {
      setIsLoading(true);
      setIsLiked(false);
      await removeLikeFromThread({
        threadId,
        userId: authorId,
        path: pathname,
      });
    } catch (error) {
      setIsLiked(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThreadLike = async () => {
    try {
      setIsLoading(true);
      setIsLiked(true);
      await addLikeToThread({
        threadId,
        userId: authorId,
        path: pathname,
      });
    } catch (error) {
      setIsLiked(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleThreadLike = async () => {
    if (likes.includes(authorId)) {
      handleThreadDislike();
    } else {
      handleThreadLike();
    }
  };

  return (
    <button
      onClick={toggleThreadLike}
      disabled={isLoading}
      className="flex items-center gap-1"
    >
      <Image
        src={
          isLiked || likes.includes(authorId)
            ? "/assets/heart-filled.svg"
            : "/assets/heart-gray.svg"
        }
        alt="Heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />

      {likes.length > 0 && (
        <p className="text-subtle-medium text-gray-1">
          {isLoading
            ? isLiked
              ? likes.length + 1
              : likes.length - 1
            : likes.length}
        </p>
      )}
    </button>
  );
}

export default LikeThread;
