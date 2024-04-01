import Link from "next/link";
import React from "react";

const ComindUsername: React.FC<{ username: string }> = ({ username }) => {
  // return <Link href="https://comind.me/users/" + {username}>{username + ": "}</Link>;
  return (
    <div className="pb-2">
      <Link href={`https://comind.me/users/${username}`}>{username}</Link>{" "}
    </div>
  );
};

export default ComindUsername;
