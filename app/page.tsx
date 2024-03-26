"use client";
import React, { useState } from "react";
import { Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";

const MainPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch("https://nimbus.pfiffer.org/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        mode: "no-cors", // TODO #1 fix fucking cors shit
      });

      if (response.ok) {
        const data = await response.json();
        const jwtToken = data.token;
        setToken(jwtToken);
      } else {
        // Handle login error
        console.error("Login error:", response);

        // Show the error message
        const errorMessage = await response.text();
        console.error("Login error:", errorMessage);
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
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <div className="flex flex-col items-center justify-center h-screen max-w-[600px] mx-auto">
          <Input
            label="Username"
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
      </main>
    </NextUIProvider>
  );
};

export default MainPage;
