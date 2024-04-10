import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [pings, setPings] = useState<Ping[]>([]);
  const [comindThoughts, setComindThoughts] = useState<Thought[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection only if token is available
  useEffect(() => {
    if (token && !websocketRef.current) {
      websocketRef.current = new WebSocket("ws://localhost:8081/ws");

      websocketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        if (token) {
          websocketRef.current?.send(JSON.stringify({ token }));
        }
      };

      websocketRef.current.onclose = () => {
        console.log("WebSocket connection closed");
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      websocketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
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

      return () => {
        websocketRef.current?.close();
      };
    }
  }, [token]);

  // Add a thought to the ThoughtProvider
  const addThought = (thought: Thought) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ thought }));
    } else {
      console.log("WebSocket is not open. Thought not sent.");
    }
    setThoughts((prevThoughts) => [...prevThoughts, thought]);
  };

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

