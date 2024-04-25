"use client";
import React, { useContext, useState } from "react";
import { Meld } from "@/lib/types/melds";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { convertToRelativeTimestamp } from "@/lib/utils";
import { AuthContext } from "@/lib/authprovider";

type MeldDisplayProps = {
  meld: Meld;
};

const MeldDisplay: React.FC<MeldDisplayProps> = ({ meld }) => {
  // Modal stuff
  const [size, setSize] = React.useState("md");
  const auth = useContext(AuthContext);

  // Load context
  const { userId } = useContext(AuthContext);

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [hovered, setHovered] = useState(true);

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(meld.date_created);
  const isUserMeld = meld.user_id == userId;

  return (
    <>
      <h3>{meld.title}</h3>
      <Markdown remarkPlugins={[remarkGfm]}>{meld.description}</Markdown>
    </>
  );
};

export default MeldDisplay;
