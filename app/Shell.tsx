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
} from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { comindContainerWidth } from "@/lib/Configuration";
import { ThoughtContext, ThoughtProvider } from "@/lib/thoughtprovider";
import { useDisclosure } from "@mantine/hooks";
import { AuthContext } from "@/lib/authprovider";

const Shell = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const { connected, currentMeldSlug } = useContext(ThoughtContext);

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 80 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { desktop: true, mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Container size={comindContainerWidth}>
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />

              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "3rem",
                }}
              >
                <ComindShort />
                {/* <Comind /> */}
              </div>

              <Group justify="space-between" style={{ flex: 1 }}>
                {isAuthenticated && (
                  <Group ml="xl" gap={10} visibleFrom="sm">
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
              <Badge variant="contrast">{currentMeldSlug}</Badge>
              <Badge variant="contrast">{username}</Badge>
            </Group>
          </div>

          <Container size={comindContainerWidth}>{children}</Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

export default Shell;
