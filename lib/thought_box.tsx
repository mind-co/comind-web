import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import ThoughtBoxEditor from "./ThoughtBoxEditor";
import { ActionIcon, Center, Container } from "@mantine/core";
import { IconBulb } from "@tabler/icons-react";

interface ThoughtBoxProps {
  onSubmit: (html: string) => void;
}

const ThoughtBox = ({ onSubmit }: ThoughtBoxProps) => {
  const editor = ThoughtBoxEditor();

  const getHTML = () => {
    return editor?.getHTML() || "";
  };

  const handleSubmit = () => {
    const html = getHTML();
    const event = new CustomEvent("submit", { detail: { html } });
    document.dispatchEvent(event);
  };

  return (
    <div style={{ position: "relative" }}>
      <RichTextEditor editor={editor}>
        {/* TODO: #6 Make thought box toolbar useful */}
        {/* <RichTextEditor.Toolbar sticky stickyOffset={60}>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar> */}

        <RichTextEditor.Content />
      </RichTextEditor>

      <div style={{ position: "absolute", bottom: "0", right: "0" }}>
        <ActionIcon
          size="xl"
          variant="default"
          mr={7}
          mb={7}
          onClick={handleSubmit}
        >
          <IconBulb size={32} />
        </ActionIcon>
        {/* <ActionIcon size="xl" variant="light" mr={4}>
          <IconBulb size={64} />
        </ActionIcon> */}
      </div>
    </div>
  );
};

export default ThoughtBox;
