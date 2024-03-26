"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";

export const MainPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("https://nimbus.pfiffer.org/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const jwtToken = data.token;
        setToken(jwtToken);
      } else {
        // Handle login error
        console.error("Login failed");
      }
    } catch (error) {
      // Handle network error
      console.error("Network error:", error);
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = () => {
    handleLogin(username, password);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Login</h1>
      <Input
        label="Username"
        color="primary"
        value={username}
        onChange={handleUsernameChange}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <button onClick={handleLoginClick}>Login</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
};
