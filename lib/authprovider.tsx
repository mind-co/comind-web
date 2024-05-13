"use client";
import React from "react";
import { createContext, useContext, useState } from "react";

// Create the authentication context
const AuthContext = createContext<{
  token: string | null;
  username: string;
  password: string;
  userId: string;
  color: string;
  isLoading: boolean;
  isAuthenticated: boolean;
  thoughtMode: "public" | "private" | "collective";

  // Context methods
  login: (username: string, password: string) => Promise<void>;
  clearAuth: () => void;
  toPublicMode: () => void;
  toPrivateMode: () => void;
  toCollectiveMode: () => void;
}>({
  token: null,
  login: async () => {},
  clearAuth: () => {},
  toPublicMode: () => {},
  toPrivateMode: () => {},
  toCollectiveMode: () => {},
  username: "",
  password: "",
  userId: "",
  color: "",
  thoughtMode: "public",
  isLoading: false,
  isAuthenticated: false,
});

class AuthProvider extends React.Component<{ children: React.ReactNode }> {
  // Create states
  state = {
    token: null as string | null,
    username: "",
    password: "",
    userId: "",
    color: "black",
    isLoading: false,
    isAuthenticated: false,
  };

  // Function to check if a token has expired
  isTokenExpired = (token: string | null): boolean => {
    if (!token) {
      return true;
    }

    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    const expirationDate = new Date(payload.exp * 1000);

    return expirationDate < new Date();
  };

  componentDidMount() {
    // Check if we already have a cookie, in which case we can log in
    const cookieToken = this.loadTokenFromCookie();
    if (
      this.state.token === null &&
      cookieToken &&
      !this.isTokenExpired(cookieToken)
    ) {
      this.setToken(cookieToken);
    }
  }

  // Function to store the authentication token in a cookie if the token is not expired
  storeTokenInCookie = (token: string, expirationDays: number = 7) => {
    if (this.isTokenExpired(token)) {
      console.log("Token has expired, not storing in cookie");
      return;
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);

    const cookieValue = `token=${token}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };

  // Function to load the authentication token from a cookie
  loadTokenFromCookie = (): string | null => {
    if (typeof document === "undefined") {
      // We're running in a server-side environment, return null
      return null;
    }

    const cookieName = "token=";
    const cookies = document.cookie.split("; ");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        const token = cookie.substring(cookieName.length, cookie.length);
        const tokenParts = token.split(".");
        const payload = JSON.parse(atob(tokenParts[1]));

        if (!this.isTokenExpired(token)) {
          return token;
        } else {
          // Token has expired, remove it from the cookie
          console.log("Token has expired, removing from cookie");
          document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      }
    }

    return null;
  };

  // Create a setter for the token state, which also updates
  // the username, user_id, and color states
  setToken = (token: string) => {
    const tokenParts = token.split(".");
    const payload = JSON.parse(atob(tokenParts[1]));
    console.log("Payload: ", payload);
    this.setState({
      token,
      username: payload.username,
      userId: payload.user_id,
      color: payload.color,
      isAuthenticated: true,
      isLoading: false,
    });

    // Store the token in a cookie
    this.storeTokenInCookie(token);
  };

  // Create a login method
  login = async (username: string, password: string) => {
    // First check if the user is already logged in
    console.log("Trying to log in", this.state);
    if (this.state.token && !this.isTokenExpired(this.state.token)) {
      console.log("Token found in state, setting token");
      this.setToken(this.state.token);
      return;
    }

    // Next, see if we already have a token in a cookie
    const cookieToken = this.loadTokenFromCookie();
    if (cookieToken && !this.isTokenExpired(cookieToken)) {
      console.log("Token found in cookie, setting token");
      this.setToken(cookieToken);
      return;
    }

    console.log("Logging in as", username);
    try {
      console.log("Pinging the server");
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
        this.setToken(jwtToken);
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
  };

  // Create a method to clear the authentication state and log out
  clearAuth = () => {
    this.setState({
      token: null,
      username: "",
      password: "",
      userId: "",
      color: "",
      isLoading: false,
      isAuthenticated: false,
    });

    // Remove the token from the cookie
    console.log("clearAuth: removing token");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  render() {
    const { children } = this.props;
    const {
      token,
      username,
      password,
      userId,
      color,
      isLoading,
      isAuthenticated,
    } = this.state;

    return (
      <AuthContext.Provider
        value={{
          token,
          login: this.login,
          clearAuth: this.clearAuth,
          username,
          password,
          userId,
          color,
          thoughtMode: "public",
          toPublicMode: () => {},
          toPrivateMode: () => {},
          toCollectiveMode: () => {},
          isLoading,
          isAuthenticated,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

// Create a custom hook to access the authentication context
const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthProvider, useAuth, AuthContext };
