"use client";
import { useContext } from "react";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "./MainPage";
import { redirect } from "next/navigation";
import Comind from "@/lib/comind";
import { Center, Container } from "@mantine/core";

// Main entry point for the application
export default function App() {
  const { token, isLoading } = useContext(AuthContext);

  // Wait on loading
  if (isLoading) {
    return (
      <Container>
        <Center>
          <Comind /> is thinking.
        </Center>
      </Container>
    );
  }

  // If we aren't logged in, redirect to the login page
  if (!token) {
    return redirect("/login");
  }

  // If we are logged in, show the main page
  return <MainPage />;
}
