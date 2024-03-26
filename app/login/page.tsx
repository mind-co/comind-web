"use client";
import React, { useContext, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthContext, AuthProvider } from "@/lib/authprovider";

export const LoginPage: React.FC = () => {
  const { token, login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
    <main className="dark text-foreground bg-background">
      <div className="flex flex-col items-center justify-center h-screen max-w-[700px] mx-auto space-y-9">
        <Input
          label="Username"
          data-lpignore="true"
          value={username}
          onChange={handleUsernameChange}
          labelPlacement="outside"
        />
        <Input
          label="Password"
          type="password"
          labelPlacement="outside"
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
