"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import { sendThoughtToDatabase } from "@/lib/api";
import { Thought } from "@/lib/types/thoughts";
import { Button } from "@nextui-org/react";
import { ThoughtContext } from "@/lib/thoughtprovider";
import Nav from "./nav";
import ThoughtList from "@/lib/display/thought_display";

import Tiptap from "@/lib/tiptap";
import Markdown from "react-markdown";
import { EditorContent, useCurrentEditor } from "@tiptap/react";
import Comind from "@/lib/comind";

import { GoLightBulb } from "react-icons/go";

import htmlToMarkdown from "@wcj/html-to-markdown";
import ComindEditor from "@/lib/tiptap";

const MainPage = () => {
  const auth = useContext(AuthContext);
  const { addThoughtToProvider, thoughts } = useContext(ThoughtContext);
  const [editorValue, setEditorValue] = useState("");
  const editor = ComindEditor({ onUpdate: setEditorValue });

  // On think method, we should send the current thought to the server.
  const onThink = async (event: any) => {
    event.preventDefault();
    console.log("Sending thought:", editorValue);

    try {
      // Call the API function to send the thought to the database, only if
      // the editor value is not empty.
      let trimmedEditorValue = editorValue.trim();
      if (trimmedEditorValue.length == 0) {
        return;
      }

      // Add the thought to the provider. This relays to the websocket server,
      // which will also handle uploading to the database.
      let thought = Thought.newThought(trimmedEditorValue, auth);
      addThoughtToProvider(thought);

      // await sendThoughtToDatabase(auth.token ?? "", trimmedEditorValue);
      // console.log("Thought sent to the database");

      // Clear the editor value
      setEditorValue("");
      editor?.commands.clearContent();
    } catch (error) {
      console.error("Error sending thought to the database:", error);
    }
  };

  // Add a submit event listener to the document.
  useEffect(() => {
    document.addEventListener("submit", onThink);
    return () => {
      document.removeEventListener("submit", onThink);
    };
  }, [editorValue]);

  return (
    <div className={"comind-center-column"}>
      <div className="pb-4">
        <Nav />
      </div>

      <div className="thought">
        welcome to <Comind />, what are you thinking about?
      </div>

      <ThoughtList thoughts={thoughts} />

      <div
        className="
        w-full relative flex flex-row align-middle justify-around
        items-center
        space-x-1
      "
      >
        {/* https://www.npmjs.com/package/react-simplemde-editor#demo */}
        <div className="w-full">
          <EditorContent editor={editor} />
        </div>

        <div className="">
          <Button
            className="text-3xl rounded-xl"
            onClick={() => {
              document.dispatchEvent(new CustomEvent("submit"));
            }}
            isIconOnly={true}
            variant="ghost"
            size="md"
          >
            <div className="">
              <GoLightBulb />
            </div>
          </Button>
        </div>
      </div>

      {/* <ThoughtDisplay thought={thoughts[0]} /> */}

      {/* <ThoughtDisplay thought={testThought} /> */}
    </div>
  );
};

export default MainPage;
