"use client";
import { Meld } from "@/lib/types/melds";
import { getUserMelds } from "@/lib/api";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import MeldDisplay from "@/lib/display/meld_display";
import Nav from "../nav";
import { addMeld } from "@/lib/api";

interface MeldPageProps {
  // Add any additional props here
}

const MeldPage: React.FC<MeldPageProps> = () => {
  const auth = useContext(AuthContext);

  // TODO First check if the user is logged in.
  // this is causing an issue with server/client mismatches.
  // Not sure how to fix

  const [melds, setMelds] = useState<Meld[]>([]);
  const token = auth.token;

  const [newMeldTitle, setNewMeldTitle] = useState("");
  const [newMeldDescription, setNewMeldDescription] = useState("");

  const handleAddMeld = async () => {
    if (newMeldTitle.trim() !== "") {
      try {
        const newMeld = {
          title: newMeldTitle,
          description: newMeldDescription,
        };
        const updatedMelds = await addMeld(auth, newMeld);
        setMelds(updatedMelds);
        setNewMeldTitle("");
        setNewMeldDescription("");
      } catch (error) {
        console.error("Error adding meld:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch melds from the API and update the state
    // Ensure this runs only on the client side
    if (typeof window !== "undefined" && token) {
      fetchMelds();
    }
  }, [token]);

  const fetchMelds = async () => {
    const userMelds = await getUserMelds(auth);
    setMelds(userMelds);
  };

  return (
    <div className="comind-center-column">
      <Nav />
      <div className="instruction">these are your melds</div>
      <div className="action-bar-meld">
        <input
          type="text"
          placeholder="new meld title"
          value={newMeldTitle}
          onChange={(e) => setNewMeldTitle(e.target.value)}
        />
        <button onClick={handleAddMeld}>add meld</button>
      </div>
      <MeldList melds={melds} />
    </div>
  );
};

interface MeldListProps {
  melds: Meld[];
}

const MeldList: React.FC<MeldListProps> = ({ melds }) => {
  if (melds.length === 0) {
    return <div>but we don`&apos;`t have any yet</div>;
  }

  return (
    <div className="meld-list">
      {melds.map((meld, index) => (
        <MeldDisplay key={index} meld={meld} />
      ))}
    </div>
  );
};

export default MeldPage;
