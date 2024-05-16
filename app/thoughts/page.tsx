"use client";
import { Thought } from "@/lib/types/thoughts";
import { getUserThoughts } from "@/lib/api";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import Nav from "../nav";
import ThoughtList from "@/lib/display/thought_display";
import { AppShell, Container } from "@mantine/core";
import Shell from "../Shell";

interface ThoughtsPageProps {
  // Add any additional props here
}

const ThoughtPage: React.FC<ThoughtsPageProps> = () => {
  const auth = useContext(AuthContext);

  // TODO First check if the user is logged in.
  // this is causing an issue with server/client mismatches.
  // Not sure how to fix

  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const token = auth.token;

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

  return (
    <Shell>
      <ThoughtList thoughts={thoughts} suggestions={{}} />
    </Shell>
  );
};
export default ThoughtPage;
