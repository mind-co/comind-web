"use client";
import React, { use, useState } from "react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

const MainPage = () => {
  const [editorValue, setEditorValue] = useState("");

  return (
    <div className="p-2 flex flex-col items-center justify-start h-screen pb-8">
      <div>
        <h1>hey, welcome to comind</h1>
        <div className="flex flex-wrap space-x-4 pb-4">
          <Link href="/thoughts">thoughts</Link>
          <Link href="/stream">streams</Link>
          <Link href="/settings">settings</Link>
        </div>
      </div>
      <div className="sm:w-full md:max-w-sm ">
        <MDEditor
          preview="edit"
          style={{}}
          hideToolbar={true}
          minHeight={50}
          height="100%"
          value={editorValue}
          onChange={(value) => setEditorValue(value || "")}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          commands={[]}
        />
      </div>
    </div>
  );
};

export default MainPage;
