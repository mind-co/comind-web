"use client";
import React, { useContext, useState } from "react";
import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthContext, AuthProvider } from "@/lib/authprovider";
import { env } from "process";
import { redirect } from "next/navigation";
import Comind from "@/lib/comind";

export const LoginPage: React.FC = () => {
  const { token, login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If we're already logged in, then
  // redirect to the home page.
  if (token) {
    // @ts-ignore
    redirect("/");
  }

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
    <main className="">
      <div
        suppressHydrationWarning
        className="flex flex-col items-center justify-center h-screen max-w-[400px] mx-auto space-y-9"
      >
        <div className="instruction">
          wanna log in to <Comind />?
        </div>
        {/* <Input
          label="Username"
          variant="bordered"
          labelPlacement="outside"
          onChange={handleUsernameChange}
        />
        <Input
          label="Password"
          type="password"
          labelPlacement="outside"
          variant="bordered"
          value={password}
          onChange={handlePasswordChange}
        /> */}
        <ButtonGroup>
          <Button onClick={handleLoginClick} variant="ghost">
            Login
          </Button>
          <Button onClick={handleLoginClick} variant="ghost">
            Sign up
          </Button>
        </ButtonGroup>
      </div>
    </main>
  );
};

export default LoginPage;
