import { Button, ButtonGroup, CardFooter, Kbd } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

type ActionBarProps = {
  onThink: () => void;
};

const ActionBar: React.FC<ActionBarProps> = ({ onThink }) => {
  return (
    <div className="flex-row flex justify-end items-end pt-2 align-center ">
      {/* 
          javascript:; goes nowhere, mostly want link styling 
          https://stackoverflow.com/questions/1830927/how-do-i-make-a-link-that-goes-nowhere
          does not add to browser history
      */}
      <Link href="javascript:;" onClick={onThink}>
        think
      </Link>
    </div>
  );
};

export default ActionBar;
