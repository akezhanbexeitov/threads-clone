import Image from "next/image";
import { FC } from "react";

interface IProps {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  type?: "User" | "Community";
}

const ProfileHeader: FC<IProps> = ({
  accountId,
  authUserId,
  name,
  username,
  imgUrl,
  bio,
  type,
}) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className=" h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={imgUrl}
              alt="Profile image"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-left text-heading3-bold text-light-1">
              {name}
            </h2>
            <p className="text-base-medium text-gray-1">@{username}</p>
          </div>
        </div>
      </div>

      {/* TODO Community */}

      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 w-full bg-dark-3" />
    </div>
  );
};

export default ProfileHeader;
