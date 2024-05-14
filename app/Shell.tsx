"use client";
import React, { useContext } from "react";
import {
  AppShell,
  Chip,
  Container,
  Indicator,
  Pill,
  Burger,
  Text,
  Group,
  UnstyledButton,
  Badge,
  Center,
  Stack,
} from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { comindContainerWidth } from "@/lib/Configuration";
import { ThoughtContext, ThoughtProvider } from "@/lib/thoughtprovider";
import { useDisclosure } from "@mantine/hooks";
import { AuthContext } from "@/lib/authprovider";
import Logo from "@/lib/Logo";

const Shell = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const { connected, currentMeldSlug } = useContext(ThoughtContext);

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 40 }}
        // navbar={{
        //   width: 300,
        //   breakpoint: "xs",
        //   collapsed: { desktop: true, mobile: !opened },
        // }}
      >
        <AppShell.Header>
          <Container size={comindContainerWidth}>
            {/* <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            /> */}

            <Group justify="space-around">
              {/* Logo */}
              {/* <Logo size={100} /> */}
              <Text size="xl">comind</Text>

              <Group justify="space-between" style={{ flex: 1 }}>
                {isAuthenticated && (
                  <Group ml="xl" gap={10}>
                    <Text size="xl">
                      <Link href="/">home</Link>
                    </Text>

                    <Text size="xl">
                      <Link href="/thoughts">thoughts</Link>
                    </Text>

                    <Text size="xl">
                      <Link href="/melds">melds</Link>
                    </Text>

                    <Text size="xl">
                      <Link href="/logout">logout</Link>
                    </Text>
                  </Group>
                )}
              </Group>
            </Group>
          </Container>
        </AppShell.Header>
        <AppShell.Main>
          {/* Connected indicator */}
          <div style={{ position: "fixed", bottom: 0, right: 0, zIndex: 1000 }}>
            <Indicator
              position="middle-start"
              color={connected ? "green" : "red"}
            >
              <Pill variant="contrast">
                {connected ? "connected" : "disconnected"}
              </Pill>
            </Indicator>
          </div>

          {/* Debug for current meld */}
          <div style={{ position: "fixed", bottom: 0, left: 0, zIndex: 1000 }}>
            <Group>
              <Badge variant="subtle">{currentMeldSlug}</Badge>
              <Badge variant="subtle">{username}</Badge>
            </Group>
          </div>

          <Container size={comindContainerWidth}>{children}</Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Shell;
