"use client";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/authprovider";
import Shell from "../Shell";
import { Center, Stack, Text, Title } from "@mantine/core";

const LogoutPage = () => {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      auth.clearAuth(); // Assuming clearAuth is the method to clear the authentication context
      router.push("/"); // Redirect to the home page after logout
    }
  }, [auth, router]);

  return (
    <Shell>
      <Center style={{ height: "60vh" }}>
        <Stack>
          <Title>you&apos;ve been logged out</Title>
          <Text size="xl">it was nice having you here</Text>
          <Text size="xl">if you ever want to come back, just sign in</Text>
        </Stack>
      </Center>
    </Shell>
  );
};

export default LogoutPage;
