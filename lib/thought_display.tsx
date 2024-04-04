"use client";
import React, { useContext, useState } from "react";
import { Thought } from "@/lib/types/thoughts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Kbd,
  Skeleton,
} from "@nextui-org/react";
import { convertToRelativeTimestamp } from "./utils";
import { AuthContext } from "./authprovider";
import ComindUsername from "./comindusername";

type ThoughtDisplayProps = {
  thought: Thought;
};

const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({ thought }) => {
  // Load context
  const { userId } = useContext(AuthContext);

  // State variables
  const [actionBarIsExpanded, setActionBarExpanded] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  const isUserThought = thought.user_id == userId;

  // On press function
  const onPress = () => {
    console.log("pressed");
  };

  // Action row toggles

  // Handle the more button click
  const handleMore = () => {
    setActionBarExpanded(!actionBarIsExpanded);
  };

  return (
    <>
      <Card className="thought" onPress={onPress} onClick={onPress}>
        {/* <ComindUsername username={thought.username} /> should enable only on hover */}

        <div className="">
          <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
        </div>
      </Card>
    </>
  );

  // return (
  //   <>
  //     <div className="thought p-1">
  //       {/* <ComindUsername username={thought.username} /> should enable only on hover */}

  //       <div className="">
  //         <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default ThoughtDisplay;
