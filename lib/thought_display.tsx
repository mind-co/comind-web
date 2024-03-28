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

  // Action row toggles

  // Handle the more button click
  const handleMore = () => {
    setActionBarExpanded(!actionBarIsExpanded);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-xs">
        {thought.username + ", " + prettyTimestamp}
      </CardHeader>
      <Divider />
      <CardBody>
        <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
      </CardBody>
      <Divider />
      <CardFooter className="text-xs">
        <ButtonGroup>
          <Button size="sm" onClick={handleMore}>
            more
            <Kbd>m</Kbd>
          </Button>
          {actionBarIsExpanded && (
            <>
              <Button size="sm">
                edit
                <Kbd>e</Kbd>
              </Button>
              <Button size="sm" isDisabled={!isUserThought}>
                delete
                <Kbd>d</Kbd>
              </Button>
              <Button size="sm" color="primary">
                think
                <Kbd>t</Kbd>
              </Button>
            </>
          )}
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default ThoughtDisplay;
