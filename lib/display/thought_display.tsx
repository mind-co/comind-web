"use client";
import React, { useState } from "react";
import { Thought } from "@/lib/types/thoughts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IconBubble,
  IconBulb,
  IconGitBranch,
  IconIdBadge,
  IconMaximize,
  IconTrash,
} from "@tabler/icons-react";
// import { convertToRelativeTimestamp } from "@/lib/utils";
// import { AuthContext } from "@/lib/authprovider";
// import Link from "next/link";

import ComindUsername from "../comindusername";
import {
  ActionIcon,
  Badge,
  Card,
  Center,
  Container,
  Group,
  Paper,
  Space,
  Timeline,
  TimelineItem,
  Text,
  Tooltip,
  useMantineTheme,
  Transition,
} from "@mantine/core";
import { convertToRelativeTimestamp } from "../utils";

type ThoughtDisplayProps = {
  thought: Thought;
};

const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({ thought }) => {
  // Modal stuff
  // const auth = useContext(AuthContext);

  // Load context
  // const { userId } = useContext(AuthContext);

  const theme = useMantineTheme();

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  // const [hovered, setHovered] = useState(true);
  // const [editorValue, setEditorValue] = useState("");

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  // const isUserThought = thought.user_id == userId;

  // Toggle context menu
  const openContextMenu = () => {
    setContextMenuVisible(!contextMenuVisible);
  };

  // const onMouseEnter = () => {
  //   setHovered(true);
  // };

  // const onMouseLeave = () => {
  //   setHovered(false);
  // };

  /**
   * Asynchronously saves a new thought based on the current editor value.
   *
   * This function first checks if the editorValue state variable, which represents
   * the content of the thought to be saved, is not empty. If it is empty, an error
   * message is logged, and the function returns early without attempting to save the thought.
   *
   * If the editorValue is not empty, the function attempts to save the thought by calling
   * the saveQuickThought function imported from "@/lib/api". This API call requires several
   * parameters:
   * - context: An object containing the authProvider with the user's token. This is used for
   *   authentication purposes.
   * - body: The content of the thought to be saved, represented by editorValue.
   * - isPublic: A boolean flag indicating whether the thought should be public. It is set to true.
   * - parentThoughtId: The ID of the parent thought, if any. In this case, it uses the ID of the
   *   thought being displayed.
   *
   * If the saveQuickThought function successfully saves the thought, a success message is logged
   * to the console along with the newly saved thought object. If the function throws an error,
   * an error message is logged to the console.
   */
  // const think = async () => {
  //   // Check if the editor value is empty
  //   if (editorValue.trim().length === 0) {
  //     console.error("Editor value is empty.");
  //     return;
  //   }

  //   try {
  //     // Attempt to save the new thought
  //     const newThought = await saveQuickThought(
  //       auth,
  //       editorValue,
  //       true,
  //       thought.id
  //     );
  //     // Log success message
  //     console.log("Thought saved successfully:", newThought);
  //   } catch (error) {
  //     // Log error message if saving fails
  //     console.error("Failed to save thought:", error);
  //   }
  // };
  return (
    <TimelineItem title={thought.title}>
      {/* Content */}
      <Card radius="md" withBorder variant="">
        <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>

        <Card.Section inheritPadding>
          <Group>
            <Tooltip label="Think">
              <ActionIcon variant="subtle" size="md">
                <IconBubble />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Remove">
              <ActionIcon variant="subtle" size="md">
                <IconTrash />
              </ActionIcon>
            </Tooltip>
          </Group>
          <Space h="xs" />
        </Card.Section>
      </Card>
      {/* Time info */}
      <Group>
        <Badge variant="transparent">{thought.username}</Badge>
        <Text size="xs">{prettyTimestamp}</Text>
      </Group>
    </TimelineItem>

    // Card variant
    // <>
    //   <Card shadow="md" padding="xs">
    //     <Group>
    //       <Badge variant="dot">{thought.username}</Badge>
    //     </Group>

    //     <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
    //     {/* <div className="w-full px-4 flex flex-row space-x-2 text-xs">
    //     <div className="text-xs">{prettyTimestamp}</div>
    //   </div> */}
    //     <Group>
    //       {/* Maximize button */}
    //       <Tooltip label="Maximize">
    //         <ActionIcon variant="subtle" size="xs">
    //           <IconMaximize />
    //         </ActionIcon>
    //       </Tooltip>
    //     </Group>
    //   </Card>
    //   <Space h="xs" />
    // </>
  );
};

interface ThoughtListProps {
  thoughts: Thought[];
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts }) => {
  if (thoughts.length === 0) {
    return <></>;
    // return <div className="w-full text-center">. . .</div>;
  }

  return (
    <Container color="red">
      <Timeline active={1} lineWidth={2}>
        {thoughts.map((thought, index) => (
          <ThoughtDisplay key={index} thought={thought} />
        ))}
      </Timeline>
    </Container>
    // <div className="thought-list">
    //   {thoughts.map((thought, index) => (
    //     <ThoughtDisplay key={index} thought={thought} />
    //   ))}
    // </div>
  );
};

export default ThoughtList;
export { ThoughtDisplay };
