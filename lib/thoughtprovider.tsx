import React, { createContext, useContext, useEffect, useState } from "react";
import { Thought, newThought, testThought } from "@/lib/types/thoughts";
import { Ping } from "@/lib/types/ping";
import { AuthContext } from "./authprovider";

interface ThoughtProviderProps {
  children: React.ReactNode;
}

interface ThoughtContextValue {
  thoughts: Thought[];
  pings: Ping[];
  comindThoughts: Thought[];
  addThought: (thought: Thought) => void;
}

const ThoughtContext = createContext<ThoughtContextValue>(
  {} as ThoughtContextValue
);

const ThoughtProvider: React.FC<ThoughtProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [thoughts, setThoughts] = useState<Thought[]>([testThought]);
  const [pings, setPings] = useState<Ping[]>([]);
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);

  // Add a thought to the ThoughtProvider
  const addThought = (thought: Thought) => {
    setThoughts((prevThoughts) => [...prevThoughts, thought]);
  };

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:8081/ws");

    // On open methods to say hi to the server
    websocket.onopen = () => {
      if (token) {
        // Send the authentication message with the JWT token
        websocket.send(JSON.stringify({ token }));
      } else {
        console.log("No token available for authentication");
        websocket.close();
      }
    };

    // On close methods to handle the connection closing
    websocket.onclose = () => {
      console.log("Connection closed");
    };

    // On error methods to handle errors
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // On message methods to handle incoming messages
    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      console.log("Received message:", message);

      if (message.thoughts) {
        setThoughts((prevThoughts) => {
          const newThoughts = message.thoughts.filter((thought: Thought) => {
            return !prevThoughts.some(
              (prevThought) => prevThought.id === thought.id
            );
          });
          return [...prevThoughts, ...newThoughts];
        });
      }

      if (message.pings) {
        setPings((prevPings) => {
          const newPings = message.pings.filter((ping: Ping) => {
            return !prevPings.some((prevPing) => prevPing.id === ping.id);
          });
          return [...prevPings, ...newPings];
        });
      }

      if (message["comind-thoughts"]) {
        setComindThoughts((prevComindThoughts) => {
          const newComindThoughts = message["comind-thoughts"].filter(
            (thought: Thought) => {
              return !prevComindThoughts.some(
                (prevThought) => prevThought.id === thought.id
              );
            }
          );
          return [...prevComindThoughts, ...newComindThoughts];
        });
      }
    };

    // return () => {
    //   websocket.close();
    // };
  }, [token]);

  const value: ThoughtContextValue = {
    thoughts,
    pings,
    comindThoughts,
    addThought,
  };

  return (
    <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>
  );
};

export { ThoughtProvider, ThoughtContext };
