import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";

// define your extension array
const extensions = [
  StarterKit,
  Extension.create({
    addKeyboardShortcuts() {
      return {
        "Cmd-Enter"() {
          document.dispatchEvent(new CustomEvent("submit"));
          return true;
        },
        "Ctrl-Enter"() {
          document.dispatchEvent(new CustomEvent("submit"));
          return true;
        },
      };
    },
  }),
];

const ThoughtBoxEditor = ({
  onUpdate,
}: {
  onUpdate?: (text: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Link,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
  });

  return useEditor({
    extensions: extensions,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getText());
      }
    },
  }) as Editor;
};

export default ThoughtBoxEditor;
