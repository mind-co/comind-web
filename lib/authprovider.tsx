"use client";
import { createContext, useContext, useState } from "react";

// Create the authentication context
const AuthContext = createContext<{
  token: string | null;
  username: string;
  password: string;
  userId: string;
  color: string;
  thoughtMode: "public" | "private" | "collective";

  // Context methods
  login: (username: string, password: string) => Promise<void>;
  toPublicMode: () => void;
  toPrivateMode: () => void;
  toCollectiveMode: () => void;
}>({
  token: null,
  login: async () => {},
  toPublicMode: () => {},
  toPrivateMode: () => {},
  toCollectiveMode: () => {},
  username: "",
  password: "",
  userId: "",
  color: "",
  thoughtMode: "public",
});

interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the authentication provider component
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Create states
  const [token, _setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [color, setColor] = useState("black");

  // Create a setter for the token state, which also updates
  // the username, user_id, and color states
  const setToken = (token: string) => {
    _setToken(token);
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    setUsername(payload.username);
    setUserId(payload.user_id);
    setColor(payload.color);
  };

  // Create a login method
  const login = async (username: string, password: string) => {
    // First check if the user is already logged in
    if (token) {
      return;
    }

    // Next, see if we already have a token in local storage
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      return;
    }

    try {
      const response = await fetch("https://nimbus.pfiffer.org/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response:", response);

      if (response.ok) {
        const data = await response.json();
        const jwtToken = data.token;
        setToken(jwtToken);
        localStorage.setItem("token", jwtToken);
      } else {
        // Handle login error
        console.error("Login error:", response);
        const errorMessage = await response.text();
        console.error("Login error:", errorMessage);
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }

    console.log("Logged in as", username);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        username,
        password,
        userId,
        color,
        thoughtMode: "public",
        toPublicMode: () => {},
        toPrivateMode: () => {},
        toCollectiveMode: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to access the authentication context
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth, AuthContext };
