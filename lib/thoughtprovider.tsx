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
import { Meld } from "./types/melds";

interface ThoughtProviderProps {
  children: React.ReactNode;
}

interface ThoughtContextValue {
  connected: boolean;
  melds: Meld[];
  pings: Ping[];
  comindThoughts: Thought[];
  addThoughtToProvider: (thought: Thought) => void;
  getCurrentMeld: () => Meld | null;
  getRootMeld: () => Meld | null;
  setCurrentMeldIndex: (index: number) => void;
}

const ThoughtContext = createContext<ThoughtContextValue>(
  {} as ThoughtContextValue
);

const ThoughtProvider: React.FC<ThoughtProviderProps> = ({ children }) => {
  const { token, userId } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [pings, setPings] = useState<Ping[]>([]);
  const [melds, setMelds] = useState<Meld[]>([]);
  const [currentMeldIndex, setCurrentMeldIndex] = useState<number>(0);
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Find the index associated with the root meld
  const findRootMeld = (): number => {
    return melds.findIndex((meld) => meld.slug === `/root/${userId}`);
  };

  const getMeldById = (id: string): Meld | null => {
    const foundMeld = melds.find((meld) => meld.meld_id === id);
    return foundMeld || null;
  };

  const getMeldBySlug = (slug: string): Meld | null => {
    const foundMeld = melds.find((meld) => meld.slug === slug);
    return foundMeld || null;
  };

  const getCurrentMeld = (): Meld | null => {
    return melds[currentMeldIndex] || null;
  };

  useEffect(() => {
    if (token && !websocketRef.current) {
      websocketRef.current = new WebSocket("ws://localhost:2333/");

      //
      // open connection
      //
      websocketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        if (token) {
          console.log("Sending token to server");
          websocketRef.current?.send(JSON.stringify({ token }));
        }

        // Set connected to true
        setConnected(true);

        // Add the root meld
        // TODO: Not clear if this will overwrite existing melds.
        //       We shouldn't have any melds at the time of creation, though
        //       this may be come an issue if we start storing or caching
        //       melds locally.
        setMelds([Meld.createRootMeld(userId)]);
      };

      websocketRef.current.onclose = (event) => {
        console.log(
          "WebSocket connection closed. Code:",
          event.code,
          "Reason:",
          event.reason
        );
        setConnected(false);
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      //
      // handle messages
      //
      websocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        if (message.auth) {
          console.log("Received auth message:", message.message);
        }

        // Check if we got a single thought. add it if we don't
        // already have a thought with it's id.
        if (message.thought) {
          // Check to see if we have a meld_slug attached, which will
          // tell us where to stick this.
          // TODO: #8 figure out what to do with client messages that don't have a meld slug
          const meld_slug = message.meld_slug ?? `/root/${userId}`;
          const meld_index = melds.findIndex((m) => m.slug === meld_slug);

          // First check if we already have the thought in prevThoughts
          const newThought = message.thought;
          const thoughtExists = melds[meld_index].thoughts.some(
            (thought) => thought.id === newThought.id
          );
          if (!thoughtExists) {
            melds[meld_index].addThought(newThought);
          }
        }

        // When we receive new thoughts.
        if (message.thoughts) {
          // Related, #8
          const meld_slug = message.meld_slug ?? `/root/${userId}`;
          const meld_index = melds.findIndex((m) => m.slug === meld_slug);

          // Convert thoughts from JSON to Thought objects
          const newThoughts = message.thoughts.map((thought: Thought) => {
            return new Thought(thought);
          });

          // Add the new thoughts to the meld
          melds[meld_index].addThoughts(newThoughts);
        }

        // When we receive suggestions
        if (message.suggestions) {
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
        if (websocketRef.current) {
          websocketRef.current.close(1000, "Closing connection normally");
        }
      };
    }
  }, [token]); // need to include thoughts here somehow

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
    melds,
    pings,
    comindThoughts,
    addThoughtToProvider,
    getCurrentMeld,
    getRootMeld: function (): Meld | null {
      throw new Error("Function not implemented.");
    },
    setCurrentMeldIndex,
  };

  return (
    <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>
  );
};

export { ThoughtProvider, ThoughtContext };
