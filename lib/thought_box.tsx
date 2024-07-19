import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import ThoughtBoxEditor from "./ThoughtBoxEditor";
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Group,
  Paper,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { IconBulb, IconSend2 } from "@tabler/icons-react";
import Box from "./Box";

interface ThoughtBoxProps {
  onSubmit: (html: string) => void;
}

const ThoughtBox = ({ onSubmit }: ThoughtBoxProps) => {
  const editor = ThoughtBoxEditor();

  const getHTML = () => {
    return editor?.getHTML() || "";
  };

  const clear = () => {
    editor?.commands.clearContent();
  };

  const handleSubmit = () => {
    const html = getHTML();
    const event = new CustomEvent("submit", { detail: { html } });
    document.dispatchEvent(event);
    clear();
  };

  return (
    <div style={{ position: "relative" }}>
      <Box title="think">
        <Container p={0} pr="xl">
          <RichTextEditor editor={editor}>
            {/* TODO: #6 Make thought box toolbar useful */}
            <RichTextEditor.Content />
          </RichTextEditor>
        </Container>

        <div style={{ position: "absolute", right: 0, bottom: 0 }}>
          <ActionIcon onClick={handleSubmit} variant="subtle" size="xl">
            <IconSend2 />
          </ActionIcon>
        </div>
      </Box>
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
      variant="subtle"
      disabled={disabled}
    >
      <Text size="md" fw={400}>
        {text}
      </Text>
    </Button>
  );
};
