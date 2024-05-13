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
  getCurrentThoughts: () => Thought[];
  getRootMeld: () => Meld | null;
  setCurrentMeldIndex: (index: number) => void;
  getCurrentSuggestions: () => { [id: string]: Thought[] };
}

const ThoughtContext = createContext<ThoughtContextValue>(
  {} as ThoughtContextValue
);

const ThoughtProvider: React.FC<ThoughtProviderProps> = ({ children }) => {
  const { token, userId } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [pings, setPings] = useState<Ping[]>([]);
  const [melds, setMelds] = useState<Meld[]>([]);
  const meldsRef = useRef<Meld[]>([]);
  const [currentMeldIndex, setCurrentMeldIndex] = useState<number>(0);
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Update the ref when the meld state changes.
  useEffect(() => {
    meldsRef.current = melds;
  }, [melds]);

  // Find the index associated with the root meld
  const findRootMeld = (): number => {
    return meldsRef.current.findIndex(
      (meld) => meld.slug === `/root/${userId}`
    );
  };

  const getMeldById = (id: string): Meld | null => {
    const foundMeld = meldsRef.current.find((meld) => meld.meld_id === id);
    return foundMeld || null;
  };

  const getMeldBySlug = (slug: string): Meld | null => {
    const foundMeld = meldsRef.current.find((meld) => meld.slug === slug);
    return foundMeld || null;
  };

  const getCurrentMeld = (): Meld | null => {
    return meldsRef.current[currentMeldIndex] || null;
  };

  const getRootMeld = (): Meld | null => {
    const rootMeldIndex = findRootMeld();
    return rootMeldIndex !== -1 ? meldsRef.current[rootMeldIndex] : null;
  };

  const getCurrentThoughts = (): Thought[] => {
    const meld = getCurrentMeld();
    return meld ? meld.thoughts : [];
  };

  const getCurrentSuggestions = (): { [id: string]: Thought[] } => {
    const meld = getCurrentMeld();
    return meld?.suggestions ?? {};
  };

  // Function to add a single suggestion to a meld
  const addSuggestionToMeld = (suggestion: Thought, meldSlug: string) => {
    setMelds((prevMelds) => {
      const meldIndex = prevMelds.findIndex((meld) => meld.slug === meldSlug);
      const meld = getMeldBySlug(meldSlug);
      if (meld) {
        const updatedMeld = meld;
        updatedMeld.addSuggestion(suggestion);
        return [
          ...prevMelds.slice(0, meldIndex),
          updatedMeld,
          ...prevMelds.slice(meldIndex + 1),
        ];
      }
      return prevMelds;
    });
  };

  // Function to add multiple suggestions to a meld
  // const addSuggestionsToMeld = (suggestions: Thought[], meldSlug: string) => {
  //   setMelds((prevMelds) => {
  //     const meld = getMeldBySlug(meldSlug);
  //     if (meld) {
  //       const updatedMeld = meld;
  //       suggestions.forEach((suggestion) => {
  //         updatedMeld.addSuggestion(suggestion);
  //       });
  //       return [
  //         ...prevMelds.slice(0, meldIndex),
  //         updatedMeld,
  //         ...prevMelds.slice(meldIndex + 1),
  //       ];
  //     }
  //     return prevMelds;
  //   });
  // };

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
        const rootMeld = Meld.createRootMeld(userId);
        setMelds([rootMeld]);
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

        // Get the meld slug associated with this message, if available.
        const meld_slug = message.meld_slug ?? `/root/${userId}`;

        // Check if we got a single thought. add it if we don't
        // already have a thought with its id.
        if (message.thought) {
          console.log("Received thought:", message.thought);
          setMelds((prevMelds) => {
            const meld = getMeldBySlug(meld_slug);
            if (meld) {
              const newThought = new Thought(message.thought);
              const thoughtExists = meld.thoughts.some(
                (thought) => thought.id === newThought.id
              );
              if (!thoughtExists) {
                meld.addThought(newThought);
                return [...prevMelds];
              }
            }
            return prevMelds;
          });
        }

        // When we receive new thoughts.
        if (message.thoughts) {
          console.log(
            "Received thoughts:",
            message.thoughts,
            message.meld_slug,
            meld_slug
          );
          setMelds((prevMelds) => {
            const meld = getMeldBySlug(meld_slug);
            if (meld) {
              const newThoughts = message.thoughts.map((thought: Thought) => {
                return new Thought(thought);
              });
              meld.addThoughts(newThoughts);
              return [...prevMelds];
            }
            return prevMelds;
          });
        }

        // When we receive suggestions
        if (message.suggestions) {
          console.log("Received suggestions:", {
            suggestions: message.suggestions,
            meld_slug: message.meld_slug,
            meld_slug_local: meld_slug,
            melds: melds,
          });
          setMelds((prevMelds) => {
            const meld = getMeldBySlug(meld_slug);
            console.log("Suggestions, found meld", {
              meld,
              meld_slug,
              suggestions: message.suggestions,
            });
            if (meld) {
              message.suggestions.forEach((suggestion: any) => {
                const thoughtId = suggestion.thought_id;
                const suggestedThought = new Thought(suggestion);
                meld.addSuggestion(suggestedThought);
              });
            }
            return prevMelds;
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

        // May or may not be in use. I think I wanted to reserve comind-thoughts for
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

      // Add the thought to the current meld
      const meld = getCurrentMeld();
      if (meld) {
        meld.addThought(thought);
      }
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
    getCurrentThoughts,
    getCurrentSuggestions,
    getRootMeld,
    setCurrentMeldIndex,
  };

  return (
    <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>
  );
};

export { ThoughtProvider, ThoughtContext };
