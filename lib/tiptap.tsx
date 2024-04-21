// lib/tiptap.jsx
import { EditorProvider, FloatingMenu, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// define your extension array
const extensions = [StarterKit];

const content = "";

const Tiptap = ({ onUpdate }: { onUpdate?: (text: string) => void }) => {
  return (
    <EditorProvider
      extensions={extensions}
      content={content}
      children={undefined}
      onUpdate={({ editor }) => {
        console.log(editor.getText());
        if (onUpdate) {
          onUpdate(editor.getText());
        }
      }}
    >
      {/* <FloatingMenu>This is the floating menu</FloatingMenu> */}
      {/* <BubbleMenu>This is the bubble menu</BubbleMenu> */}
    </EditorProvider>
  );
};

export default Tiptap;
