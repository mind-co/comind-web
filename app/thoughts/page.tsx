"use client";
import { Thought } from "@/lib/types/thoughts";
import { getUserThoughts } from "@/lib/api";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import Nav from "../nav";
import ThoughtList, { ThoughtDisplay } from "@/lib/display/thought_display";
import { AppShell, Card, Container, Overlay, Text } from "@mantine/core";
import Shell from "../Shell";
import ThoughtBox from "@/lib/thought_box";
import TurndownService from "turndown";
import ThoughtBoxEditor from "@/lib/ThoughtBoxEditor";
import { ThoughtContext } from "@/lib/thoughtprovider";
import { comindContainerWidth } from "@/lib/Configuration";
import DelveView from "@/lib/DelveView";

interface ThoughtsPageProps {
  // Add any additional props here
}

const ThoughtPage: React.FC<ThoughtsPageProps> = () => {
  const auth = useContext(AuthContext);
  const [delveViewOpen, setDelveViewOpen] = useState(false);
  const { delvingThoughtId } = useContext(ThoughtContext);

  // Used for converting Tiptap HTML to markdown.
  var turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    hr: "---",
  });

  const editor = ThoughtBoxEditor();

  // TODO First check if the user is logged in.
  // this is causing an issue with server/client mismatches.
  // Not sure how to fix

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const token = auth.token;

  const {
    addThoughtToProvider,
    getCurrentThoughts,
    getCurrentSuggestions,
    activeMeldSlug,
    currentMeldTitle,
    currentMeldDescription,
  } = useContext(ThoughtContext);

  useEffect(() => {
    // Fetch thoughts from the API and update the state
    // Ensure this runs only on the client side
    if (typeof window !== "undefined" && token) {
      fetchThoughts();
    }
  }, [token]);

  const fetchThoughts = async () => {
    const userThoughts = await getUserThoughts(auth);
    setThoughts(userThoughts);
  };

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
      thoughts.push(thought);

      // await sendThoughtToDatabase(auth.token ?? "", trimmedEditorValue);
      // console.log("Thought sent to the database");

      // Clear the editor value
      console.log(editor);
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
  }, []);

  if (delvingThoughtId) {
    return (
      <>
        <Shell>
          <DelveView />
        </Shell>
      </>
    );
  }

  return (
    <Shell>
      <Text>{delvingThoughtId}</Text>
      <ThoughtList thoughts={thoughts} suggestions={{}} />

      <div
        style={{
          position: "fixed",
          bottom: 40,
          left: 10,
          right: 10,
        }}
      >
        <Container size={comindContainerWidth}>
          <ThoughtBox onSubmit={onThink} />
        </Container>
      </div>
    </Shell>
  );
};
export default ThoughtPage;
