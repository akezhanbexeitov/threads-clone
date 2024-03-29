import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import DeleteThread from "../forms/DeleteThread";
import { ObjectId } from "mongoose";
import LikeThread from "../forms/LikeThread";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface IProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
    _id: ObjectId;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    _id: ObjectId;
    text: string;
    author: {
      _id: string;
      name: string;
      image: string;
    };
    likes: ObjectId[];
    parentId: ObjectId;
    childrem: ObjectId[];
  }[];
  isComment?: boolean;
  likes: ObjectId[];
}

const ThreadCard: FC<IProps> = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
  likes,
}) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-4 md:p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${author.id}`}
              className="h-11 w-11 overflow-hidden rounded-full"
            >
              <Image
                src={author.image}
                alt="Profile image"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="thread-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <TooltipProvider>
                <div className="flex gap-3.5">
                  <Tooltip>
                    <TooltipTrigger>
                      <LikeThread
                        threadId={id}
                        authorId={author._id}
                        likes={likes}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-subtle-medium text-gray-1">Like</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <Link href={`/thread/${id}`}>
                        <Image
                          src="/assets/reply.svg"
                          alt="Reply"
                          width={24}
                          height={24}
                          className="cursor-pointer object-contain"
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-subtle-medium text-gray-1">Reply</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* TODO Implement repost functionality */}
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="/assets/repost.svg"
                        alt="Repost"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-subtle-medium text-gray-1">Repost</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* TODO Implement share functionality */}
                  <Tooltip>
                    <TooltipTrigger>
                      <Image
                        src="/assets/share.svg"
                        alt="Share"
                        width={24}
                        height={24}
                        className="cursor-pointer object-contain"
                      />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="text-subtle-medium text-gray-1">Share</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger>
                      <DeleteThread
                        threadId={JSON.stringify(id)}
                        currentUserId={currentUserId}
                        authorId={author.id}
                        parentId={parentId}
                        isComment={isComment}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-subtle-medium text-gray-1">Delete</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TODO Delete thread */}

      {/* Show comment logos */}
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <div
              key={String(comment._id)}
              className={`${
                index !== 0 && "-ml-5"
              } h-6 w-6 overflow-hidden rounded-full`}
            >
              <Image
                src={comment.author.image}
                alt={`user_${comment.author._id}`}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {/* TODO Fix the createdAt bug */}
      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)} - {community.name} Community
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;
