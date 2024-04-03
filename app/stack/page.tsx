"use client";
import React, { useContext, useState } from "react";
import { ThoughtContext } from "@/lib/thoughtprovider";

const ChatPage = () => {
  const { thoughts, pings, comindThoughts, sendMessage } =
    useContext(ThoughtContextValue);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Page</h1>
      <div>
        {thoughts.map((thought) => (
          <p key={thought.id}>{thought.content}</p>
        ))}
        {pings.map((ping) => (
          <p key={ping.id}>{ping.content}</p>
        ))}
        {comindThoughts.map((thought) => (
          <p key={thought.id}>{thought.content}</p>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatPage;
