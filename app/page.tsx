"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/lib/authprovider";
import MeldView from "../lib/MeldView";
import { Center, Text } from "@mantine/core";
import { ThoughtContext } from "@/lib/thoughtprovider";
import Link from "next/link";
import Shell from "./Shell";
import Logo from "@/lib/Logo";

// Main entry point for the application
export default function App() {
  const { isAuthenticated, isLoading, token } = useContext(AuthContext);
  const { setActiveToRootMeld } = useContext(ThoughtContext);

  // Set to root meld on page load
  useEffect(() => {
    setActiveToRootMeld();
  }, []);

  console.log({ isAuthenticated, isLoading, token });

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
        {/* <ComindShort /> */}
        <Logo size={200} />

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
  if (!isAuthenticated && !isLoading) {
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
  return (
    <Shell>
      <MeldView />
    </Shell>
  );
}
