"use client";
import React, { use, useContext, useState } from "react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import ActionBar from "@/lib/actionbar";
import { AuthContext } from "@/lib/authprovider";
import { sendThoughtToDatabase } from "@/lib/api";
import ThoughtDisplay from "@/lib/thought_display";
import { testThought } from "@/lib/types/thoughts";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

const MainPage = () => {
  const { token } = useContext(AuthContext);
  const [editorValue, setEditorValue] = useState("");

  // On think method, we should send the current thought to the server.
  const onThink = async () => {
    try {
      // Call the API function to send the thought to the database
      await sendThoughtToDatabase(token ?? "", editorValue);
      console.log("Thought sent to the database");
    } catch (error) {
      console.error("Error sending thought to the database:", error);
    }
  };

  return (
    <div className="max-w-lg dark p-2 flex flex-col items-center justify-start h-screen pb-8 mx-auto">
      <div>
        hey, welcome to comind
        <div className="flex flex-row space-x-4 pb-4 align-middle justify-center">
          <Link className="text-xs" href="/thoughts">
            thoughts
          </Link>
          <Link className="text-xs" href="/stream">
            streams
          </Link>
          <Link className="text-xs" href="/settings">
            settings
          </Link>
        </div>
      </div>
      <Card className="w-full">
        <CardBody>
          <MDEditor
            preview="edit"
            defaultTabEnable={false}
            autoFocus={true}
            minHeight={50}
            height={50}
            enableScroll={false}
            hideToolbar={true}
            value={editorValue}
            onChange={(value) => setEditorValue(value || "")}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            commands={[]}
          />
        </CardBody>
        <Divider />
        <ActionBar onThink={onThink} />
      </Card>

      <ThoughtDisplay thought={testThought} />
    </div>
  );
};

export default MainPage;
