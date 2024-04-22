// lib/tiptap.jsx
import { Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

const ComindEditor = ({ onUpdate }: { onUpdate?: (text: string) => void }) => {
  return useEditor({
    extensions: extensions,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getText());
      }
    },
  });
};

export default ComindEditor;
