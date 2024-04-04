"use client";
import React, { use, useContext, useState } from "react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import ActionBar from "@/lib/actionbar";
import { AuthContext } from "@/lib/authprovider";
import { sendThoughtToDatabase } from "@/lib/api";
import ThoughtDisplay from "@/lib/thought_display";
import { newThought, coThought } from "@/lib/types/thoughts";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@nextui-org/react";
import ComindUsername from "@/lib/comindusername";
import { ThoughtContext } from "@/lib/thoughtprovider";

const MainPage = () => {
  const auth = useContext(AuthContext);
  const { addThought, thoughts } = useContext(ThoughtContext);
  const [editorValue, setEditorValue] = useState("");

  // On think method, we should send the current thought to the server.
  const onThink = async () => {
    try {
      // Call the API function to send the thought to the database, only if
      // the editor value is not empty.
      let trimmedEditorValue = editorValue.trim();
      if (trimmedEditorValue.length == 0) {
        return;
      }

      // Add the thought to the provider
      let thought = newThought(trimmedEditorValue, auth);
      addThought(thought);

      await sendThoughtToDatabase(auth.token ?? "", trimmedEditorValue);
      console.log("Thought sent to the database");

      // Clear the editor value
      setEditorValue("");
    } catch (error) {
      console.error("Error sending thought to the database:", error);
    }
  };

  return (
    <div className="max-w-xl p-2 flex flex-col h-screen mx-auto">
      <div className="">
        <span className="instruction">
          hey, welcome to{" "}
          <span className="">
            <span className="">co</span>
            <span className="">mi</span>
            <span className="">nd</span>.
          </span>
        </span>
        <div className="flex flex-row justify-end space-x-4 pb-4">
          <Link className="" href="/thoughts/">
            thoughts
          </Link>
          <Link className="" href="/melds/">
            melds
          </Link>
          <Link className="" href="/settings/">
            settings
          </Link>
        </div>
      </div>

      <div className="">
        {thoughts.map((thought) => (
          <ThoughtDisplay key={thought.id} thought={thought} />
        ))}
      </div>

      <div
        className="
        w-full
      "
      >
        <div className="py-2 fixed bottom-0 max-w-xl w-full">
          <Textarea
            value={editorValue}
            onValueChange={setEditorValue}
            minRows={1}
          />
          <Button
            onClick={onThink}
            onPress={onThink}
            size="sm"
            className="absolute bottom-3 right-1"
          >
            think
          </Button>
        </div>

        {/* <div
          className="
          w-full border-2 rounded-lg border-gray-300 dark:border-gray-700
        "
        > */}
        {/* <MDEditor
            preview="edit"
            defaultTabEnable={false}
            autoFocus={true}
            minHeight={25}
            height={40}
            style={{
              fontFamily: "Lexend Deca",
            }}
            hideToolbar={true}
            value={editorValue}
            onChange={(value) => setEditorValue(value || "")}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            commands={[]}
          /> */}
        {/* </div> */}
      </div>

      {/* <ThoughtDisplay thought={thoughts[0]} /> */}

      {/* <ThoughtDisplay thought={testThought} /> */}
    </div>
  );
};

export default MainPage;
