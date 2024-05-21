"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/lib/authprovider";
import Shell from "../Shell";
import { Center, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

const LogoutPage = () => {
  const auth = useContext(AuthContext);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    if (auth && auth.token != null && !signedOut) {
      auth.clearAuth(); // Assuming clearAuth is the method to clear the authentication context
      setSignedOut(true);
    }
  }, [auth, setSignedOut]);

  return (
    <Shell>
      <Center style={{ height: "60vh" }}>
        <Stack>
          <Title>you&apos;ve been logged out</Title>
          <Text size="xl">it was nice having you here</Text>
          <Text size="xl">
            if you ever want to come back, just{" "}
            <Link href="/login" passHref>
              sign in again
            </Link>
          </Text>
        </Stack>
      </Center>
    </Shell>
  );
};

export default LogoutPage;
