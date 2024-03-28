"use client";
import React, { useContext, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthContext, AuthProvider } from "@/lib/authprovider";
import { env } from "process";

export const LoginPage: React.FC = () => {
  const { token, login, _setToken } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // Check if we're in debug mode. If so, fill in the username and
  // password fields with some default values and log in automatically.
  if (process.env.COMIND_DEBUG === "true") {
    login(username, password);
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = () => {
    console.log(
      "Logging in with username:",
      username,
      "and password:",
      password
    );
    // Call login for the auth service
    login(username, password);
  };

  return (
    <main className="text-foreground bg-background">
      <div className="flex flex-col items-center justify-center h-screen max-w-[400px] mx-auto space-y-9">
        <h1>hey, welcome to comind</h1>

        <Input
          type="username"
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
        <Button onClick={handleLoginClick}>Login</Button>
        {token && <p>Token: {token}</p>}
      </div>
    </main>
  );
};

export default LoginPage;
