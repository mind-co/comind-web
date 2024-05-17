"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
// import { sendThoughtToDatabase } from "@/lib/api";
import { Thought } from "@/lib/types/thoughts";
import { ThoughtContext } from "@/lib/thoughtprovider";
import Nav from "../app/nav";
import ThoughtList from "@/lib/display/thought_display";

import { EditorContent } from "@tiptap/react";
import Comind from "@/lib/comind";

import ThoughtBox from "@/lib/thought_box";
import {
  Alert,
  AppShell,
  AppShellFooter,
  Burger,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Space,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import Link from "next/link";

import { useTheme } from "next-themes";
import ThoughtBoxEditor from "@/lib/ThoughtBoxEditor";
import Shell from "@/app/Shell";
import { comindContainerWidth } from "./Configuration";

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      The current theme is: {theme}
      <button onClick={() => setTheme("light")}>Light Mode</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
    </div>
  );
};

const MeldView = () => {
  const auth = useContext(AuthContext);
  const {
    addThoughtToProvider,
    getCurrentThoughts,
    getCurrentSuggestions,
    activeMeldSlug,
    currentMeldTitle,
    currentMeldDescription,
  } = useContext(ThoughtContext);
  const [editorValue, setEditorValue] = useState("");
  const editor = ThoughtBoxEditor({ onUpdate: setEditorValue });
  const [opened, { toggle }] = useDisclosure();

  // On think method, we should send the current thought to the server.
  const onThink = async (event: any) => {
    event.preventDefault();
    console.log("Sending thought:", editorValue);

    try {
      // Call the API function to send the thought to the database, only if
      // the editor value is not empty.
      let trimmedEditorValue = editorValue.trim();
      if (trimmedEditorValue.length == 0) {
        console.log("Editor value is empty, not sending thought");
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
      editor.commands.clearContent();
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
    <>
      {/* THE THOUGHT BOX */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          backgroundColor: "var(--mantine-color-body)",
          paddingBottom: "54px",
        }}
      >
        <Container size={comindContainerWidth}>
          <ThoughtBox editor={editor} />
        </Container>
      </div>

      <ThoughtList
        thoughts={getCurrentThoughts()}
        suggestions={getCurrentSuggestions()}
      />

      {/* <Container size="sm">
        <SuggestionList thoughts={getCurrentSuggestions()} />
      </Container> */}
    </>
  );
};

export default MeldView;
