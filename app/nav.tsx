'use client'
import React, { useContext } from "react";
import Link from "next/link";
import Comind from "@/lib/comind";
import { AuthContext } from "@/lib/authprovider";

const Nav = () => {
  const auth = useContext(AuthContext);

  return (
    <div className="flex flex-row justify-between space-x-4 pb-4">
      <Comind />
      <div className="nav-links space-x-2">
        <Link href="/thoughts/">thoughts</Link>
        <Link href="/melds/">melds</Link>
        <Link href="/settings/">settings</Link>
        <Link href="/logout/">logout</Link>
      </div>
    </div>
  );
};

export default Nav;
