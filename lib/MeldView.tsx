"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
// import { sendThoughtToDatabase } from "@/lib/api";
import { Thought } from "@/lib/types/thoughts";
import { ThoughtContext } from "@/lib/thoughtprovider";
import Nav from "../app/nav";
import ThoughtList from "@/lib/display/thought_display";

import TurndownService from "turndown";

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
  Text,
} from "@mantine/core";
import { useDisclosure, useScrollIntoView } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import Link from "next/link";

import { useTheme } from "next-themes";
import ThoughtBoxEditor from "@/lib/ThoughtBoxEditor";
import Shell from "@/app/Shell";
import { comindContainerWidth } from "./Configuration";
import Logo from "./Logo";

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
  // Scroll to the bottom of the page.
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  // Used for converting Tiptap HTML to markdown.
  var turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
  });

  const auth = useContext(AuthContext);
  const {
    addThoughtToProvider,
    getCurrentThoughts,
    getCurrentSuggestions,
    activeMeldSlug,
    currentMeldTitle,
    currentMeldDescription,
  } = useContext(ThoughtContext);
  const editor = ThoughtBoxEditor();
  const [opened, { toggle }] = useDisclosure();

  // On think method, we should send the current thought to the server.
  const onThink = async (event: any) => {
    event.preventDefault();

    try {
      // Try to convert the HTML value from the editor into markdown
      console.log(event);
      let markdownValue = turndownService.turndown(event.detail.html);

      // Call the API function to send the thought to the database, only if
      // the editor value is not empty.
      let trimmedEditorValue = markdownValue.trim();
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
      editor.commands.clearContent();
      editor.commands.blur();
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
  }, []);

  const numberOfThoughts = getCurrentThoughts().length;

  return (
    <>
      <Center>
        <Logo size={80} />
      </Center>

      {numberOfThoughts > 0 && (
        <>
          <ThoughtList
            thoughts={getCurrentThoughts()}
            suggestions={getCurrentSuggestions()}
          />
        </>
      )}

      {/* THE THOUGHT BOX */}
      {numberOfThoughts === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: numberOfThoughts === 0 ? "50vh" : "auto",
            flex: 1,
          }}
        >
          <div style={{ width: "100%" }}>
            <ThoughtBox onSubmit={onThink} />
          </div>
        </div>
      ) : (
        <>
          <Space my="md" />
          <ThoughtBox onSubmit={onThink} />
        </>
      )}

      {/* <Container size="sm">
        <SuggestionList thoughts={getCurrentSuggestions()} />
      </Container> */}
    </>
  );
};

export default MeldView;
