import Link from "next/link";
import React from "react";

const ComindUsername: React.FC<{ username: string }> = ({ username }) => {
  // return <Link href="https://comind.me/users/" + {username}>{username + ": "}</Link>;
  return (
    <span className="!text-xs">
      <Link href={`https://comind.me/users/${username}`}>{username}</Link>{" "}
    </span>
  );
};

export default ComindUsername;
