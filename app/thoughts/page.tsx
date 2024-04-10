"use client";
import { Thought } from "@/lib/types/thoughts";
import { getUserThoughts } from "@/lib/api";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import ThoughtDisplay from "@/lib/thought_display";
import Nav from "../nav";

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
    <div className="comind-center-column">
      <Nav />
      <div className="instruction">
        these are your <Link href="/thoughts">thoughts</Link>
      </div>
      <ThoughtList thoughts={thoughts} />
    </div>
  );
};

interface ThoughtListProps {
  thoughts: Thought[];
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts }) => {
  if (thoughts.length === 0) {
    return <div>but we don't have any yet</div>;
  }

  return (
    <div className="thought-list">
      {thoughts.map((thought, index) => (
        <ThoughtDisplay key={index} thought={thought} />
      ))}
    </div>
  );
};

export default ThoughtPage;
