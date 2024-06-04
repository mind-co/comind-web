import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import ThoughtBoxEditor from "./ThoughtBoxEditor";
import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  Space,
  Text,
} from "@mantine/core";
import { IconBulb } from "@tabler/icons-react";

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
      <RichTextEditor editor={editor}>
        {/* TODO: #6 Make thought box toolbar useful */}
        <RichTextEditor.Content />
      </RichTextEditor>

      <Space my={4}></Space>

      <Group justify="flex-end">
        {ComindButton(
          "now",
          () => {
            console.error("now not implemented");
          },
          true
        )}
        {ComindButton("think", handleSubmit)}
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
