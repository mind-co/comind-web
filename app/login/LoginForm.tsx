"use client";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/lib/authprovider";
import { useRouter } from "next/navigation";
import Comind from "@/lib/comind";
import { Button, ButtonGroup, Container, Input, Space } from "@mantine/core";
import Shell from "../Shell";

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(username, password);
    router.push("/");
  };

  return (
    <Shell>
      <Container size="xs">
        <form onSubmit={handleLoginClick}>
          <div className="instruction">
            wanna log in to <Comind />?
          </div>
          <Space h="md" />
          <Input
            size="lg"
            onChange={handleUsernameChange}
            placeholder="username"
            autoComplete="username"
          />
          <Space h="md" />
          <Input
            size="lg"
            type="password"
            placeholder="password"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="current-password"
          />
          <Space h="md" />
          <ButtonGroup>
            <Button type="submit" variant="default">
              Login
            </Button>
            {/* <Button onClick={handleLoginClick} variant="ghost">
                   Sign up
                 </Button> */}
          </ButtonGroup>
        </form>
      </Container>
    </Shell>
  );
};

export default LoginForm;
