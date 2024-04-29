"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Thought } from "@/lib/types/thoughts";
import { Ping } from "@/lib/types/ping";
import { AuthContext } from "./authprovider";

interface ThoughtProviderProps {
  children: React.ReactNode;
}

interface ThoughtContextValue {
  connected: boolean;
  thoughts: Thought[];
  pings: Ping[];
  comindThoughts: Thought[];
  addThoughtToProvider: (thought: Thought) => void;
}

const ThoughtContext = createContext<ThoughtContextValue>(
  {} as ThoughtContextValue
);

const ThoughtProvider: React.FC<ThoughtProviderProps> = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [recommended, setRecommended] = useState<Thought[]>([]);
  const [pings, setPings] = useState<Ping[]>([]);
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection only if token is available
  useEffect(() => {
    if (token && !websocketRef.current) {
      websocketRef.current = new WebSocket("ws://localhost:2333/");

      websocketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        if (token) {
          console.log("Sending token to server");
          websocketRef.current?.send(JSON.stringify({ token }));
        }
        setConnected(true);
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      websocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        if (message.auth) {
          console.log("Received auth message:", message.message);
        }

        // Check if we got a single thought. add it if we don't
        // already have a thought with it's id.
        if (message.thought) {
          // First check if we already have the thought in prevThoughts
          const newThought = message.thought;
          const thoughtExists = thoughts.some(
            (thought) => thought.id === newThought.id
          );
          if (!thoughtExists) {
            setThoughts((prevThoughts) => [...prevThoughts, newThought]);
          }
        }

        // When we receive new thoughts.
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

        // Handles notifications.
        if (message.pings) {
          setPings((prevPings) => {
            const newPings = message.pings.filter((ping: Ping) => {
              return !prevPings.some((prevPing) => prevPing.id === ping.id);
            });
            return [...prevPings, ...newPings];
          });
        }

        // May or may not be in use. I think I wanted to reserver comind-thoughts for
        // system messages.
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

      return () => {
        websocketRef.current?.close();
      };
    }
  }, [token]);

  // Add a thought to the ThoughtProvider. This function
  //
  // 1. Sends a thought to the websocket server, if available.
  // 2. Adds the thought to the thoughts state.
  //
  // TODO #5 handle thought submission failures
  const addThoughtToProvider = (thought: Thought) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ thought }));
    } else {
      console.log("WebSocket is not open. Thought not sent.");
    }
  };

  const value: ThoughtContextValue = {
    connected,
    thoughts,
    pings,
    comindThoughts,
    addThoughtToProvider,
  };

  return (
    <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>
  );
};

export { ThoughtProvider, ThoughtContext };
