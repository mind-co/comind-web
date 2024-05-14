"use client";
import { useContext } from "react";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "../lib/MeldView";
import { redirect } from "next/navigation";
import Comind from "@/lib/comind";
import { Center, Container, Space, Text, Title } from "@mantine/core";
import { ThoughtProvider } from "@/lib/thoughtprovider";
import ComindShort from "@/lib/ComindShort";
import Link from "next/link";
import Shell from "./Shell";

// Main entry point for the application
export default function App() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Wait on loading
  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "20vmin" }}>
          {/* <ComindShort /> */}
          <Comind />
        </div>

        <div style={{ fontSize: "5vmin" }}>
          is thinking
          {/* <Comind /> */}
        </div>

        {!isAuthenticated && (
          <div style={{ fontSize: "5vmin" }}>
            do you want to <Link href="/login">login</Link>?
          </div>
        )}

        {/* <div style={{ fontSize: "5vmin" }}>we promise</div> */}
      </div>
    );
  }

  // If we aren't logged in, redirect to the login page
  if (!isAuthenticated) {
    return (
      <Shell>
        <Center style={{ height: "60vh" }}>
          <Text size="xl">
            you really gotta login to use comind, go{" "}
            <Link href="/login">login</Link>
          </Text>
        </Center>
      </Shell>
    );
  }

  // If we are logged in, show the main page
  return <MainPage />;
}
