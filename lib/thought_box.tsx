import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import ThoughtBoxEditor from "./ThoughtBoxEditor";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  Space,
  Text,
} from "@mantine/core";
import { IconBulb, IconSend } from "@tabler/icons-react";
import { ThoughtContext, ThoughtProvider } from "./thoughtprovider";
import { useContext } from "react";

interface ThoughtBoxProps {
  onSubmit: (html: string) => void;
}

const ThoughtBox = ({ onSubmit }: ThoughtBoxProps) => {
  const { fetchSuggestionsForCurrentMeld } = useContext(ThoughtContext);
  const editor = ThoughtBoxEditor();

  const getHTML = () => {
    return editor?.getHTML() || "";
  };

  const clear = () => {
    editor?.commands.clearContent();
  };

  const handleFetchSuggestions = () => {
    fetchSuggestionsForCurrentMeld();
  };

  const handleSubmit = () => {
    const html = getHTML();
    console.log(html);
    const event = new CustomEvent("submit", { detail: { html } });
    document.dispatchEvent(event);
    clear();
  };

  return (
    <div style={{ position: "relative" }}>
      {/* <Divider my="md" label="+" /> */}
      <Card p={0}>
        <RichTextEditor
          editor={editor}
          styles={{
            root: {
              borderWidth: 0,
              borderRadius: "0px",
              border: "0px",
              backgroundColor: "transparent",
            },
            content: {
              borderRadius: "0px",
              border: "0px",
              // backgroundColor: "",
              padding: "0.4rem",
              backgroundColor: "transparent",
            },
          }}
        >
          {/* TODO: #6 Make thought box toolbar useful */}
          <RichTextEditor.Content />
        </RichTextEditor>
      </Card>

      <Space my={4}></Space>

      <Group justify="flex-end">
        {/* {ComindButton(
          "now",
          () => {
            console.error("now not implemented");
          },
          true
        )} */}
        {/* {/ {ComindButton("think", handleSubmit)} */}

        <ActionIcon variant="subtle" onClick={handleFetchSuggestions}>
          <IconBulb />
        </ActionIcon>

        <ActionIcon variant="subtle" onClick={handleSubmit}>
          <IconSend />
        </ActionIcon>
      </Group>
      {/* <div style={{ position: "absolute", bottom: "0", right: "0" }}>
        <ActionIcon
          size="xl"
          variant="default"
          mr={7}
          mb={7}
          onClick={handleSubmit}
        >
          <IconBulb size={32} />
        </ActionIcon>
      </div> */}
    </div>
  );
};

export default ThoughtBox;
const ComindButton = (
  text: string,
  handleSubmit: () => void,
  disabled: boolean = false
) => {
  return (
    <Button
      size="xs"
      onClick={handleSubmit}
      variant="outline"
      disabled={disabled}
    >
      <Text size="md" fw={400}>
        {text}
      </Text>
    </Button>
  );
};
