"use client";
import React, { useContext, useEffect, useState } from "react";
import { Thought } from "@/lib/types/thoughts";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  IconBulb,
  IconPlus,
  IconInfoCircle,
  IconLock,
  IconWorld,
  IconMinus,
  IconX,
  IconBulbFilled,
  IconBulbOff,
  IconCheck,
  IconLink,
  IconCircle,
} from "@tabler/icons-react";
import TurndownService from "turndown";
// import { convertToRelativeTimestamp } from "@/lib/utils";
// import { AuthContext } from "@/lib/authprovider";
// import Link from "next/link";

import ComindUsername from "../comindusername";
import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Space,
  Flex,
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
  Paper,
  Pill,
  Button,
  ButtonGroup,
  CardSection,
  Container,
  Stack,
  Spoiler,
  Anchor,
  Center,
} from "@mantine/core";
import { convertToRelativeTimestamp } from "../utils";
import { useDisclosure } from "@mantine/hooks";
import {
  deleteThought,
  fetchSuggestions,
  linkThoughts,
  saveThought,
  sendThoughtToDatabase,
  setPublic,
  unlinkThoughts,
} from "../api";
import { AuthContext } from "../authprovider";
import ThoughtBoxEditor from "../ThoughtBoxEditor";
import { RichTextEditor } from "@mantine/tiptap";
import Link from "next/link";
import { ThoughtContext } from "../thoughtprovider";

// Visual stuff
const lineWidth = 2;
const bulletSize = 18;

type ThoughtDisplayProps = {
  thought: Thought;
  suggestions: Thought[];
};

const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({ thought }) => {
  // Modal stuff
  // const auth = useContext(AuthContext);

  // Load context
  // const { userId } = useContext(AuthContext);

  const theme = useMantineTheme();
  const auth = useContext(AuthContext);
  const { setDelvingThoughtId } = useContext(ThoughtContext);

  // Info modal stuff
  const [opened, { open, close }] = useDisclosure(false);

  // State variables
  const [verbsVisible, setVerbsVisible] = useState(false);
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [delveViewOpen, setDelveViewOpen] = useState(false);
  const [isPublicThought, setIsPublicThought] = useState(thought.public);
  const [thoughtBodyHidden, setThoughtBodyHidden] = useState(false);
  const [newThoughtBoxIsOpen, setNewThoughtBoxIsOpen] = useState(false);
  const [deletePressCount, setDeletePressCount] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const [newThoughtContent, setNewThoughtContent] = useState("");
  const [editThoughtContent, setEditThoughtContent] = useState(thought.body);
  const [editMode, setEditMode] = useState(false);
  const [suggestions, setSuggestions] = useState<Thought[]>([]);

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  // const isUserThought = thought.user_id == userId;

  const handleSendThought = async () => {
    try {
      if (newThoughtContent.trim().length === 0) {
        console.log("New thought content is empty, not sending thought");
        return;
      }

      if (auth.token) {
        let newThought = Thought.newThought(
          newThoughtContent,
          auth,
          undefined,
          thought.id
        );
        await saveThought(auth, newThought, true);
        console.log("Thought sent to the database");
        setNewThoughtContent("");
        setNewThoughtBoxIsOpen(false);
      } else {
        console.error(
          "User token is missing, unable to send thought to database"
        );
      }
    } catch (error) {
      console.error("Error sending thought to the database:", error);
    }
  };

  // Toggle context menu
  const toggleContextMenu = () => {
    setMoreMenuVisible(!moreMenuVisible);

    // Reset the delete press count
    setDeletePressCount(0);
  };

  // Toggle suggestions
  const toggleSuggestionsOpen = () => {
    // If it's open then close it.
    if (suggestionsOpen) {
      setSuggestionsOpen(false);
      return;
    }

    // If we have any suggestions, we can just open the suggestions
    if (suggestions.length > 0) {
      setSuggestionsOpen(true);
      return;
    }

    // Otherwise, we need to generate suggestions
    fetchSuggestions(auth, thought.id).then((suggestions) => {
      setSuggestions(suggestions);
    });

    setSuggestionsOpen(!suggestionsOpen);
  };

  const toggleDelveView = () => {
    setDelvingThoughtId(thought.id);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const togglePublic = async () => {
    try {
      console.log("Toggling public status", auth);
      await setPublic(auth, thought.id, !isPublicThought);
      // Update the local thought state to reflect the new public status
      setIsPublicThought(!isPublicThought);
    } catch (error) {
      console.error("Failed to toggle public status:", error);
    }
  };

  const toggleNewThoughtBox = () => {
    setNewThoughtBoxIsOpen(!newThoughtBoxIsOpen);
  };

  const toggleThoughtBodyVisibility = () => {
    setThoughtBodyHidden(!thoughtBodyHidden);
  };

  // Handle delete
  const handleDelete = async () => {
    setDeletePressCount(deletePressCount + 1);

    if (deletePressCount >= 2) {
      try {
        await deleteThought(auth, thought.id);
        // Optionally, update the UI to remove the deleted thought
        // For example, if thoughts are stored in a state variable:
        setDeleted(true);
      } catch (error) {
        console.error("Failed to delete thought:", error);
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    console.log("Saving", editThoughtContent);
    try {
      // Copy the thought and update the body
      const editedThought = { ...thought, body: editThoughtContent };

      // TODO: #12 check if the thought has been changed upon save
      await saveThought(auth, editedThought, false);
      console.log("Thought saved successfully.", editThoughtContent);

      thought.body = editThoughtContent;

      // Close the edit mode
      setEditMode(false);
    } catch (error) {
      console.error("Failed to save thought:", error);
    }
  };

  // Verb button configs
  const verbButtonSize = "xs";
  const verbButtonTextSize = "xs";
  const verbButtonColor = "gray";
  const verbButtonVariant = "outline";
  const verbButtonStyle = {
    borderColor: theme.colors.gray[7],
  };

  if (deleted) {
    return <></>;
  }

  return (
    <>
      {/* Misc modals and shit */}
      <Modal opened={opened} onClose={close} title="Info" centered size="lg">
        <Text>{thought.id}</Text>
      </Modal>

      {/* Title and username */}
      <Group justify="space-between" align="center">
        {/* <Group>
          <Text c={thoughtBodyHidden ? "" : "dimmed"} fw={200}>
            {thought.title}
          </Text>
        </Group> */}
        <Text c="dimmed" fw={200}>
          {thought.username}
        </Text>
      </Group>

      {/* The thought body, including verb bar */}
      {!thoughtBodyHidden && (
        <>
          {/* Content */}
          <Paper
            withBorder
            radius="lg"
            p="xs"
            style={{ position: "relative" }}
            w="100%"
          >
            {editMode && (
              <>
                <EditThoughtBox
                  initialContent={editThoughtContent}
                  onUpdate={(content) => {
                    setEditThoughtContent(content);
                    console.log("Content updated", content);
                  }}
                />
              </>
            )}

            {!editMode && (
              <>
                <TypographyStylesProvider>
                  {
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {thought.body}
                    </Markdown>
                  }
                </TypographyStylesProvider>
              </>
            )}

            {/* 
            =========================================
            ██╗   ██╗███████╗██████╗ ██████╗ ███████╗
            ██║   ██║██╔════╝██╔══██╗██╔══██╗██╔════╝
            ██║   ██║█████╗  ██████╔╝██████╔╝███████╗
            ╚██╗ ██╔╝██╔══╝  ██╔══██╗██╔══██╗╚════██║
             ╚████╔╝ ███████╗██║  ██║██████╔╝███████║
              ╚═══╝  ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝
            =========================================
            */}

            {/* New thought box */}
            {newThoughtBoxIsOpen && (
              <>
                <NewThoughtBox
                  parentThoughtId={thought.id}
                  content={newThoughtContent}
                  setContent={setNewThoughtContent}
                />

                <Space h="sm" />
              </>
            )}

            {verbsVisible && (
              <>
                <Divider my="xs" label="verbs" />
                <Group justify="end" p="0" m="0" gap="4px">
                  {!newThoughtBoxIsOpen && (
                    <>
                      {moreMenuVisible && (
                        <>
                          {/* Delete */}
                          <Tooltip label="delete this thought">
                            <Button
                              variant={"default"}
                              size={verbButtonSize}
                              color={
                                deletePressCount == 0
                                  ? verbButtonColor
                                  : deletePressCount == 1
                                  ? "yellow"
                                  : "red"
                              }
                              style={verbButtonStyle}
                              onClick={handleDelete}
                            >
                              <Text size={verbButtonTextSize}>
                                {deletePressCount == 0
                                  ? "delete"
                                  : deletePressCount == 1
                                  ? "are you sure?"
                                  : "CLICK TO DELETE"}
                              </Text>
                            </Button>
                          </Tooltip>

                          {/* Public/private */}
                          <Tooltip
                            label={
                              thought.public
                                ? "make this thought private"
                                : "make this thought public"
                            }
                          >
                            <Button
                              radius="lg"
                              size={verbButtonSize}
                              variant={verbButtonVariant}
                              color={verbButtonColor}
                              onClick={togglePublic}
                              style={verbButtonStyle}
                            >
                              <Text size={verbButtonTextSize}>
                                {isPublicThought ? "private" : "public"}
                              </Text>
                            </Button>
                          </Tooltip>

                          {/* Info */}
                          <Tooltip label="Info" variant="outline">
                            <Button
                              radius="lg"
                              size={verbButtonSize}
                              variant={verbButtonVariant}
                              color={verbButtonColor}
                              onClick={open}
                              style={verbButtonStyle}
                            >
                              <Text size={verbButtonTextSize}>info</Text>
                            </Button>
                          </Tooltip>
                        </>
                      )}

                      {/* More button */}
                      <Button
                        size={verbButtonSize}
                        variant={verbButtonVariant}
                        color={verbButtonColor}
                        onClick={toggleContextMenu}
                        style={verbButtonStyle}
                      >
                        <Text size={verbButtonTextSize}>
                          {moreMenuVisible ? "less" : "more"}
                        </Text>
                      </Button>

                      {/* Save button */}
                      {editMode && (
                        <Button
                          size={verbButtonSize}
                          color="green"
                          variant="filled"
                          onClick={handleSave}
                          style={verbButtonStyle}
                        >
                          <Text size={verbButtonTextSize}>Save</Text>
                        </Button>
                      )}

                      {/* Cancel button */}
                      {editMode && (
                        <Button
                          size={verbButtonSize}
                          color="red"
                          variant="filled"
                          onClick={() => setEditMode(false)}
                          style={verbButtonStyle}
                        >
                          <Text size={verbButtonTextSize}>Cancel</Text>
                        </Button>
                      )}

                      {/* edit button */}
                      {!editMode && (
                        <Button
                          size={verbButtonSize}
                          variant={verbButtonVariant}
                          color={verbButtonColor}
                          onClick={toggleEditMode}
                          style={verbButtonStyle}
                        >
                          <Text size={verbButtonTextSize}>edit</Text>
                        </Button>
                      )}

                      {/* delve button */}
                      <Button
                        size={verbButtonSize}
                        variant={verbButtonVariant}
                        color={verbButtonColor}
                        onClick={toggleDelveView}
                        style={verbButtonStyle}
                      >
                        <Text size={verbButtonTextSize}>delve</Text>
                      </Button>

                      {/* suggest button */}
                      <>
                        <Button
                          size={verbButtonSize}
                          variant={verbButtonVariant}
                          color={suggestionsOpen ? "red" : verbButtonColor}
                          onClick={toggleSuggestionsOpen}
                          style={verbButtonStyle}
                        >
                          <Text size={verbButtonTextSize}>
                            {suggestionsOpen ? "slose" : "suggest"}
                          </Text>
                        </Button>
                      </>

                      {/* Think button */}
                      <Button
                        size={verbButtonSize}
                        variant={verbButtonVariant}
                        color={verbButtonColor}
                        onClick={toggleSuggestionsOpen}
                        style={verbButtonStyle}
                        disabled={true}
                      >
                        <Text size={verbButtonTextSize}>think</Text>
                      </Button>
                    </>
                  )}

                  {/* Add to thought */}
                  <ActionIcon
                    radius="lg"
                    size="md"
                    variant={verbButtonVariant}
                    color={verbButtonColor}
                    onClick={toggleNewThoughtBox}
                    style={verbButtonStyle}
                  >
                    {newThoughtBoxIsOpen ? (
                      <IconX size={20} />
                    ) : (
                      <IconPlus size={20} />
                    )}
                  </ActionIcon>

                  {newThoughtBoxIsOpen && (
                    <ActionIcon
                      radius="lg"
                      size="md"
                      variant={verbButtonVariant}
                      color={verbButtonColor}
                      onClick={handleSendThought}
                      style={verbButtonStyle}
                    >
                      <IconCheck />
                    </ActionIcon>
                  )}

                  {/* Suggestions */}
                  {suggestionsOpen && suggestions && (
                    <>
                      <Card radius="xl" withBorder>
                        {suggestions.map((suggestion, index) => (
                          <SuggestionDisplay
                            key={suggestion.id}
                            thought={suggestion}
                            parent_thought_id={thought.id}
                          />
                        ))}
                      </Card>
                      <Divider my="md" />
                    </>
                  )}
                </Group>

                <Space h="xs" />
              </>
            )}

            {/* Verb bar toggle */}
            <div
              style={{
                position: "absolute",
                bottom: "-16px",
                right: "0px",
                left: "0px",
                textAlign: "center",
              }}
            >
              <ActionIcon
                // variant="filled"
                variant="outline"
                style={{
                  backgroundColor: "var(--mantine-color-dark-filled-hover)",
                  borderColor: "var(--mantine-color-dark-outline)",
                }}
                size="sm"
                onClick={() => setVerbsVisible(!verbsVisible)}
              >
                {/* {verbsVisible ? <IconX size={18} /> : <IconCircle size={18} />} */}
              </ActionIcon>
            </div>
          </Paper>
        </>
      )}
    </>
  );
};

type SuggestionDisplayProps = {
  thought: Thought;
  parent_thought_id: string;
};

const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({
  thought,
  parent_thought_id,
}) => {
  // Modal stuff
  const auth = useContext(AuthContext);

  // State variables
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [linked, setLinked] = useState(false);
  // const [hovered, setHovered] = useState(true);
  // const [editorValue, setEditorValue] = useState("");

  // Date created converted to a pretty date time
  const prettyTimestamp = convertToRelativeTimestamp(thought.date_created);
  // const isUserThought = thought.user_id == userId;

  return (
    <>
      <Group justify="space-between" align="center">
        <div style={{ fontFamily: "Bungee" }}>
          <Text>{thought.title}</Text>
        </div>

        <Badge variant="default">{thought.username}</Badge>
      </Group>

      {!linked && (
        <>
          <Space h="xs" />
          <Tooltip label="Cosine similarity. This is a rough measure of how similar this thought is to the parent thought.">
            <Progress
              value={
                thought.cosine_similarity ? thought.cosine_similarity * 100 : 0
              }
            />
          </Tooltip>
          <Space h="xs" />

          <Spoiler maxHeight={100} showLabel="Show more" hideLabel="Show less">
            <TypographyStylesProvider>
              <Markdown remarkPlugins={[remarkGfm]}>{thought.body}</Markdown>
            </TypographyStylesProvider>
          </Spoiler>

          <Space h="xs" />
        </>
      )}
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

        <Group gap="xs">
          {linked ? (
            <Anchor
              component="button"
              onClick={() => {
                unlinkThoughts(auth, thought.id, parent_thought_id);
                setLinked(false);
              }}
            >
              unlink
            </Anchor>
          ) : (
            <Anchor
              component="button"
              onClick={() => {
                linkThoughts(auth, thought.id, parent_thought_id);
                setLinked(true);
              }}
            >
              link
            </Anchor>
          )}
        </Group>
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

  if (thoughts.length === 0) {
    return <></>;
  }

  return (
    <>
      {thoughts.map((thought, index) => (
        <React.Fragment key={index}>
          <ThoughtDisplay
            thought={thought}
            suggestions={suggestions ? suggestions[thought.id] : []}
          />
          <Space my="md" />
        </React.Fragment>
      ))}
    </>
  );
};

interface NewThoughtBoxProps {
  parentThoughtId?: string | null;
  content: string;
  setContent: (content: string) => void;
}

const NewThoughtBox: React.FC<NewThoughtBoxProps> = ({
  parentThoughtId,
  content,
  setContent,
}) => {
  const editor = ThoughtBoxEditor({ onUpdate: setContent });
  const auth = useContext(AuthContext);

  // Used for converting Tiptap HTML to markdown.
  var turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
  });

  // On think method, we should send the current thought to the server.
  const onThink = async (event: any) => {
    event.preventDefault();

    try {
      // Try to convert the HTML value from the editor into markdown
      let markdownValue = turndownService.turndown(event.detail.html);

      // Call the API function to send the thought to the database, only if
      // the editor value is not empty.
      let trimmedEditorValue = markdownValue.trim();
      if (trimmedEditorValue.length == 0) {
        console.log("Editor value is empty, not sending thought");
        return;
      }

      // Add the thought to the provider. This relays to the websocket server,
      // which will also handle uploading to the database.
      if (auth.token) {
        // Pass the parentThoughtId when creating a new thought
        let thought = Thought.newThought(
          trimmedEditorValue,
          auth,
          undefined,
          parentThoughtId
        );
        await saveThought(auth, thought, true);
        console.log("Thought sent to the database");
      } else {
        console.error(
          "User token is missing, unable to send thought to database"
        );
      }
      // // Clear the editor value
      // editor.commands.clearContent();
    } catch (error) {
      console.error("Error sending thought to the database:", error);
    }
  };

  const getHTML = () => {
    return editor?.getHTML() || "";
  };

  const handleSubmit = () => {
    const html = getHTML();
    const event = new CustomEvent("submit", { detail: { html } });
    document.dispatchEvent(event);
  };

  // Add a submit event listener to the document.
  useEffect(() => {
    document.addEventListener("submit", onThink);
    return () => {
      document.removeEventListener("submit", onThink);
    };
  }, []);

  useEffect(() => {
    const onUpdate = () => {
      const html = getHTML();
      const markdownValue = turndownService.turndown(html);
      setContent(markdownValue);
    };

    editor?.on("update", onUpdate);

    return () => {
      editor?.off("update", onUpdate);
    };
  }, [editor]);

  return (
    <Paper w="100%">
      <RichTextEditor editor={editor} autoFocus={true}>
        <RichTextEditor.Content />
      </RichTextEditor>

      {/* <div style={{ position: "absolute", bottom: "0", right: "0" }}>
        <ActionIcon
          size="xl"
          variant="filled"
          mr={7}
          mb={7}
          onClick={handleSubmit}
        >
          <IconPlus size={32} />
        </ActionIcon> */}
      {/* <ActionIcon size="xl" variant="light" mr={4}>
          <IconBulb size={64} />
        </ActionIcon> */}
      {/* </div> */}
    </Paper>
  );
};

interface EditThoughtBoxProps {
  initialContent: string;
  onUpdate: (content: string) => void;
}

const EditThoughtBox: React.FC<EditThoughtBoxProps> = ({
  initialContent,
  onUpdate,
}) => {
  const editor = ThoughtBoxEditor({
    onUpdate: onUpdate,
    initialContent: initialContent,
  });

  return (
    <>
      <RichTextEditor editor={editor} autoFocus={true}>
        <RichTextEditor.Content />
      </RichTextEditor>
      {/* <div
        style={{
          marginTop: "10px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      > */}
    </>
  );
};

export default ThoughtList;
export { ThoughtDisplay, SuggestionDisplay };
