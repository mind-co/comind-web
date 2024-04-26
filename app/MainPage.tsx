"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
// import { sendThoughtToDatabase } from "@/lib/api";
import { Thought } from "@/lib/types/thoughts";
import { ThoughtContext } from "@/lib/thoughtprovider";
import Nav from "./nav";
import ThoughtList from "@/lib/display/thought_display";

import { EditorContent } from "@tiptap/react";
import Comind from "@/lib/comind";

import ThoughtBox from "@/lib/thought_box";
import {
  AppShell,
  Burger,
  Button,
  Center,
  Container,
  Grid,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor } from "@mantine/tiptap";
import Link from "next/link";

import { useTheme } from "next-themes";
import ThoughtBoxEditor from "@/lib/ThoughtBoxEditor";

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

const MainPage = () => {
  const auth = useContext(AuthContext);
  const { addThoughtToProvider, thoughts } = useContext(ThoughtContext);
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
    <AppShell
      padding="md"
      header={{ height: 30 }}
      // navbar={{
      //   width: 200,
      //   breakpoint: "sm",
      //   collapsed: { mobile: !opened },
      // }}
    >
      <AppShell.Header>
        <Container size="sm">
          {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
          <Comind /> | <Link href="/thoughts">thoughts</Link> |{" "}
          <Link href="/melds">melds</Link>
        </Container>
        {/* <Nav /> */}
      </AppShell.Header>

      {/* <AppShell.Navbar>nav</AppShell.Navbar> */}

      <AppShell.Main>
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: "var(--mantine-color-body)",
            paddingBottom: "32px",
          }}
        >
          <Container>
            <ThoughtBox editor={editor} />
          </Container>
        </div>

        {/* <EditorContent editor={editor} /> */}
        {/* <Button
              className="text-3xl rounded-xl"
              onClick={() => {
                document.dispatchEvent(new CustomEvent("submit"));
              }}
              variant="ghost"
              size="md"
            >
              submit
            </Button> */}
        <Container>
          <ThoughtList thoughts={thoughts} />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default MainPage;
