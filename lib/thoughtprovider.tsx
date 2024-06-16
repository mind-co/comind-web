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
import { saveThought } from "./api";

interface ThoughtProviderProps {
  children: React.ReactNode;
}

interface ThoughtContextValue {
  connected: boolean;
  melds: { [slug: string]: Meld };
  pings: Ping[];
  comindThoughts: Thought[];
  addThoughtToProvider: (thought: Thought) => void;
  getCurrentMeld: () => Meld | null;
  getCurrentThoughts: () => Thought[];
  getRootMeld: () => Meld | null;
  setCurrentMeldSlug: (slug: string) => void;
  getCurrentSuggestions: () => { [thoughtId: string]: Thought[] };
  setActiveMeld: (slug: string) => void;
  setActiveToRootMeld: () => void;
  meldSlugs: string[];
  meldIds: string[];
  activeMeldSlug: string;
  currentMeldSlug: string;
  currentSlugIsLoaded: boolean;
  currentMeldTitle: string;
  currentMeldDescription: string;
  delvingThoughtId: string | null;
  setDelvingThoughtId: (thoughtId: string | null) => void;
}

const ThoughtContext = createContext<ThoughtContextValue>(
  {} as ThoughtContextValue
);

const ThoughtProvider: React.FC<ThoughtProviderProps> = ({ children }) => {
  const { token, userId, username } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [pings, setPings] = useState<Ping[]>([]);
  const [delvingThoughtId, setDelvingThoughtId] = useState<string | null>(null);
  const [melds, setMelds] = useState<{ [slug: string]: Meld }>({});
  const meldsRef = useRef<{ [slug: string]: Meld }>({});
  const [currentMeldSlug, setCurrentMeldSlug] = useState<string>(
    `/root/${userId}`
  );
  const [currentMeldTitle, setCurrentMeldTitle] = useState<string>("");
  const [currentMeldDescription, setCurrentMeldDescription] =
    useState<string>("");
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Update the ref when the meld state changes.
  useEffect(() => {
    meldsRef.current = melds;
  }, [melds]);

  // Set the active meld
  const setActiveMeld = (slug: string) => {
    console.log("Trying to switch to slug", slug);

    // Send a message to the server to switch to the meld
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ meld_slug_request: slug }));
    }

    // Optimistically set the current meld slug
    setCurrentMeldSlug(slug);
  };

  // Set the active meld to the root meld
  const setActiveToRootMeld = () => {
    const rootMeld = getRootMeld();
    if (rootMeld) {
      setActiveMeld(rootMeld.slug);
    }
  };

  // List of meld slugs. Mostly used for debugging.
  const meldSlugs = Object.keys(melds);
  const meldIds = Object.values(melds).map((meld) => meld.id);
  const activeMeldSlug = currentMeldSlug;
  const currentSlugIsLoaded = meldSlugs.includes(activeMeldSlug);

  const getMeldById = (id: string): Meld | null => {
    return (
      Object.values(meldsRef.current).find((meld) => meld.id === id) || null
    );
  };

  const getMeldBySlug = (slug: string): Meld | null => {
    return meldsRef.current[slug] || null;
  };

  const getCurrentMeld = (): Meld | null => {
    return meldsRef.current[currentMeldSlug] || null;
  };

  const getRootMeld = (): Meld | null => {
    return meldsRef.current[`/root/${userId}`] || null;
  };

  const getCurrentThoughts = (): Thought[] => {
    const meld = getCurrentMeld();
    return meld ? meld.thoughts : [];
  };

  const getCurrentSuggestions = (): { [thoughtId: string]: Thought[] } => {
    const meld = getCurrentMeld();
    return meld ? meld.suggestions : {};
  };

  // Function to add a single suggestion to a meld
  const addSuggestionToMeld = (suggestion: Thought, meldSlug: string) => {
    setMelds((prevMelds) => {
      const meld = getMeldBySlug(meldSlug);
      if (meld) {
        const updatedMeld = meld;
        updatedMeld.addSuggestion(suggestion);
        return {
          ...prevMelds,
          [meldSlug]: updatedMeld,
        };
      }
      return prevMelds;
    });
  };

  // Function to add a meld to the list if it doesn't already exist
  const addMeldIfNotExists = (meld: Meld) => {
    setMelds((prevMelds) => {
      if (!prevMelds[meld.slug]) {
        return { ...prevMelds, [meld.slug]: meld };
      }
      return prevMelds;
    });
  };

  useEffect(() => {
    if (token && !websocketRef.current) {
      // websocketRef.current = new WebSocket("ws://localhost:2333/");
      websocketRef.current = new WebSocket("wss://nimbus.pfiffer.org/ws");

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
        addMeldIfNotExists(rootMeld);

        // Set the current meld slug to the root meld
        setCurrentMeldSlug(rootMeld.slug);
        setCurrentMeldTitle(rootMeld.title);
        setCurrentMeldDescription(rootMeld.description);
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

        // Check if we got a server message
        if (message.message) {
          console.log("Received server message:", message.message);

          // If we got "here is the meld you requested" then set the meld to the meld we requested
          if (message.message === "here is the meld you requested") {
            // We should have meld and meld_slug keys.
            if (message.meld && message.meld_slug) {
              const meld = new Meld(message.meld);
              const meldSlug = message.meld_slug;
              addMeldIfNotExists(meld);
              setCurrentMeldSlug(meldSlug);
              setCurrentMeldTitle(meld.title);
              setCurrentMeldDescription(meld.description);
            }
          }
        }

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
                return { ...prevMelds, [meld_slug]: meld };
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
              return { ...prevMelds, [meld_slug]: meld };
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
              // Add the suggestions to the meld
              message.suggestions.forEach((suggestion: any) => {
                const thoughtId = suggestion.thought_id;
                const suggestedThought = new Thought(suggestion);

                // Check if the suggestion already exists in the meld
                const suggestionExists = meld.suggestions[thoughtId]?.some(
                  (existingSuggestion) =>
                    existingSuggestion.id === suggestedThought.id
                );

                if (!suggestionExists) {
                  meld.addSuggestion(suggestedThought);
                }
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
        setMelds((prevMelds) => ({ ...prevMelds, [currentMeldSlug]: meld }));
      }
    } else {
      console.log(
        "WebSocket is not open. Thought not sent. Attempting to send thought to server via HTTPS"
      );

      try {
        saveThought({ token, username: username }, thought, true).then(
          (response) => {
            console.log("Saved thought to server via HTTPS:", response);
          }
        );
      } catch (error) {
        console.error("Failed to send thought to server via HTTPS:", error);
      }
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
    setCurrentMeldSlug,
    setActiveMeld,
    setActiveToRootMeld,
    meldSlugs,
    meldIds,
    activeMeldSlug,
    currentSlugIsLoaded,
    currentMeldTitle,
    currentMeldDescription,
    currentMeldSlug,
    delvingThoughtId,
    setDelvingThoughtId,
  };

  return (
    <ThoughtContext.Provider value={value}>{children}</ThoughtContext.Provider>
  );
};

export { ThoughtProvider, ThoughtContext };
