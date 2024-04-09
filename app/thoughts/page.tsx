"use client";
import { Thought } from "@/lib/types/thoughts";
import { getUserThoughts } from "@/lib/api";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";

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
      console.log("Fetching thoughts");
      fetchThoughts();
    }
  }, [token]);
  
  const fetchThoughts = async () => {
      const userThoughts = await getUserThoughts(token);
      console.log("Fetched thoughts")
      setThoughts(userThoughts);
  };

  return (
    <div className="instruction comind-center-column">
      these are your <Link href="/thoughts">thoughts</Link>
      <ThoughtList thoughts={thoughts} />
    </div>
  );
};

interface ThoughtListProps {
  thoughts: Thought[];
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts }) => {
  if (thoughts.length === 0) {
    return <div>No thoughts yet.</div>;
  }

  return (
    <div className="thought-list">
      {thoughts.map((thought, index) => (
        <div key={index} className="thought">
          <p>{thought.body}</p>
        </div>
      ))}
    </div>
  );
};


export default ThoughtPage;
