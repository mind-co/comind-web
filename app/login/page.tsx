"use client";
import React, { useContext, useState } from "react";
import { AuthContext, AuthProvider } from "@/lib/authprovider";
import { env } from "process";
import { redirect } from "next/navigation";
import Comind from "@/lib/comind";
import { Button, ButtonGroup, Container, Input, Space } from "@mantine/core";
import Shell from "../Shell";

const LoginPage: React.FC = () => {
  const { token, login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // If we're already logged in, then
  // redirect to the home page.
  if (token) {
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
    <Shell>
      <Container size="sm">
        <main className="">
          <div suppressHydrationWarning>
            <div className="instruction">
              wanna log in to <Comind />?
            </div>
            <Space h="md" />
            <Input
              size="lg"
              onChange={handleUsernameChange}
              placeholder="username"
            />
            <Space h="md" />
            <Input
              size="lg"
              type="password"
              placeholder="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Space h="md" />
            <ButtonGroup>
              <Button onClick={handleLoginClick} variant="default">
                Login
              </Button>
              {/* <Button onClick={handleLoginClick} variant="ghost">
                Sign up
              </Button> */}
            </ButtonGroup>
          </div>
        </main>
      </Container>
    </Shell>
  );
};

export default LoginPage;
