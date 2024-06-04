import { Link, RichTextEditor } from "@mantine/tiptap";
import { Editor, Extension, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import TurndownService from "turndown";

interface ThoughtBoxEditorProps {
  onUpdate?: (markdown: string) => void;
  initialContent?: string;
}

const ThoughtBoxEditor = (
  { onUpdate, initialContent }: ThoughtBoxEditorProps = {
    onUpdate: () => {},
    initialContent: "",
  }
) => {
  // Used for converting Tiptap HTML to markdown.
  var turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
  });

  // define your extension array
  const extensions = [
    StarterKit,
    Extension.create({
      addKeyboardShortcuts() {
        return {
          "Cmd-Enter"({ editor }) {
            document.dispatchEvent(new CustomEvent("submit"));
            const event = new CustomEvent("submit", {
              detail: { html: editor?.getHTML() },
            });
            return true;
          },
          "Ctrl-Enter"({ editor }) {
            console.log("Ctrl-Enter");
            document.dispatchEvent(new CustomEvent("submit"));
            const event = new CustomEvent("submit", {
              detail: { html: editor?.getHTML() },
            });
            return true;
          },
        };
      },
    }),
  ];

  return useEditor({
    content: initialContent,
    onUpdate: onUpdate
      ? ({ editor }) => {
          const html = editor.getHTML().trim();
          const markdown = turndownService.turndown(html).trim();
          onUpdate(markdown);
        }
      : () => {},
    extensions: extensions,
  }) as Editor;
};

export default ThoughtBoxEditor;
