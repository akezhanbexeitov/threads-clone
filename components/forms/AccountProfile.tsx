"use client";

import { FC } from "react";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile: FC<Props> = ({ user, btnTitle }) => {
  return <div>Account profile</div>;
};

export default AccountProfile;
