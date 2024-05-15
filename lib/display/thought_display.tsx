"use client";
import React, { useState } from "react";
import { Thought } from "@/lib/types/thoughts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IconArrowBarToUp,
  IconBubble,
  IconBulb,
  IconChevronCompactDown,
  IconChevronCompactUp,
  IconGitBranch,
  IconIdBadge,
  IconMaximize,
  IconPlus,
  IconLineDashed,
  IconTrash,
  IconInfoCircle,
  IconLock,
  IconGlobe,
  IconWorld,
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
  TypographyStylesProvider,
  Divider,
  ScrollArea,
  Box,
  Modal,
  Progress,
  ThemeIcon,
} from "@mantine/core";
import { convertToRelativeTimestamp } from "../utils";
import { useDisclosure } from "@mantine/hooks";

// Visual stuff
const lineWidth = 2;
const bulletSize = 18;

type ThoughtDisplayProps = {
  thought: Thought;
  suggestions: Thought[];
};

const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({
  thought,
  suggestions,
}) => {
  // Modal stuff
  // const auth = useContext(AuthContext);

  // Load context
  // const { userId } = useContext(AuthContext);

  const theme = useMantineTheme();

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  // const [hovered, setHovered] = useState(true);
  // const [editorValue, setEditorValue] = useState("");

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  // const isUserThought = thought.user_id == userId;

  // Toggle context menu
  const openContextMenu = () => {
    setContextMenuVisible(!contextMenuVisible);
  };

  // Toggle suggestions
  const toggleSuggestionsOpen = () => {
    setSuggestionsOpen(!suggestionsOpen);
  };

  // Info modal stuff
  const [opened, { open, close }] = useDisclosure(false);

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

  // Visual configs
  const buttonSize = "xs";
  const buttonColor = "light";

  //

  return (
    <>
      {/* Misc modals and shit */}
      <Modal opened={opened} onClose={close} title="Info" centered size="lg">
        <Text>{thought.id}</Text>
      </Modal>

      <Group justify="space-between" align="center">
        <div style={{ fontFamily: "Bungee" }}>
          <Text>{thought.title}</Text>
        </div>
        <Badge variant="default">{thought.username}</Badge>
      </Group>

      {/* Content */}
      <TypographyStylesProvider>
        <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
      </TypographyStylesProvider>

      {/* <Divider my="md" /> */}

      <Space h="xs" />

      {/* Time info */}
      <Group justify="space-between">
        <Group>
          <ThemeIcon variant="default" color="gray" size="xs">
            {thought.public ? <IconWorld /> : <IconLock />}
          </ThemeIcon>
          <Text size="xs" c="dimmed">
            {prettyTimestamp}
          </Text>
        </Group>

        <Group>
          <Tooltip label="Info">
            <ActionIcon
              variant="subtle"
              size={buttonSize}
              color={buttonColor}
              onClick={open}
            >
              <IconInfoCircle />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Think">
            <ActionIcon variant="subtle" size={buttonSize} color={buttonColor}>
              <IconBubble />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Remove">
            <ActionIcon variant="subtle" size={buttonSize} color={buttonColor}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Divider
        labelPosition="center"
        my="md"
        label={
          suggestions?.length > 0 ? (
            <ActionIcon
              variant="subtle"
              size="md"
              onClick={toggleSuggestionsOpen}
            >
              {suggestionsOpen ? (
                <IconChevronCompactUp />
              ) : (
                <IconChevronCompactDown />
              )}
            </ActionIcon>
          ) : (
            <IconLineDashed />
          )
        }
      />

      {/* Suggestions */}
      {suggestionsOpen && suggestions && (
        <>
          <Card radius="xl" withBorder>
            {suggestions.map((suggestion, indexb) => (
              <>
                <SuggestionDisplay key={suggestion.id} thought={suggestion} />
              </>
            ))}
          </Card>
          <Divider my="md" />
        </>
      )}
    </>
  );
};

type SuggestionDisplayProps = {
  thought: Thought;
};

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({ thought }) => {
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

  const buttonSize = "sm";
  const buttonColor = "light";

  return (
    <>
      <Group justify="space-between" align="center">
        <div style={{ fontFamily: "Bungee" }}>
          <Text>{thought.title}</Text>
        </div>
        <Progress
          value={
            thought.cosine_similarity ? thought.cosine_similarity * 100 : 0
          }
        />

        <Badge variant="default">{thought.username}</Badge>
      </Group>
      <TypographyStylesProvider>
        <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
      </TypographyStylesProvider>

      <Space h="xs" />

      {/* Time info */}
      <Group>
        <ThemeIcon variant="default" color="gray" size="xs">
          {thought.public ? <IconWorld /> : <IconLock />}
        </ThemeIcon>
        <Text size="xs" c="dimmed">
          {prettyTimestamp}
        </Text>
      </Group>

      <Divider my="md" />
    </>
  );
};

interface ThoughtListProps {
  thoughts: Thought[];
  suggestions: { [id: string]: Thought[] };
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts, suggestions }) => {
  if (thoughts.length === 0) {
    return <></>;
    // return <div className="w-full text-center">. . .</div>;
  }

  const [suggestionsOpen, setSuggestionsOpen] = useState<boolean[]>(
    new Array(thoughts.length).fill(false) as boolean[]
  );

  // Toggle suggestions open
  const toggleSuggestionsOpen = (index: number) => {
    setSuggestionsOpen((prev) => {
      const newArray = [...prev];
      newArray[index] = !newArray[index];
      return newArray;
    });
  };

  return (
    <>
      {thoughts.map((thought, index) => (
        <React.Fragment key={index}>
          <ThoughtDisplay
            thought={thought}
            suggestions={suggestions ? suggestions[thought.id] : []}
          />
        </React.Fragment>
      ))}
    </>
  );
};

// const SuggestionList: React.FC<ThoughtListProps> = ({ thoughts }) => {
//   if (thoughts.length === 0) {
//     return <></>;
//   }

//   const [open, setOpen] = useState(true);

//   return (
//     <div>
//       <Divider
//         label={
//           <>
//             <ActionIcon
//               variant="subtle"
//               size="md"
//               onClick={() => setOpen(!open)}
//             >
//               {open ? <IconChevronCompactUp /> : <IconChevronCompactDown />}
//             </ActionIcon>
//           </>
//         }
//         labelPosition="center"
//         my="sm"
//       />
//       {open && (
//         <>
//           <ScrollArea h={250} type="auto">
//             <Timeline active={1} lineWidth={lineWidth} bulletSize={bulletSize}>
//               {thoughts.map((thought, index) => (
//                 <SuggestionDisplay
//                   key={index}
//                   thought={thought}
//                   suggestions={suggestions[thought.id]}
//                 />
//               ))}
//             </Timeline>
//           </ScrollArea>
//           <Divider label="suggestions" labelPosition="center" my="sm" />
//         </>
//       )}
//     </div>
//   );
// };

export default ThoughtList;
export { ThoughtDisplay, SuggestionDisplay };
