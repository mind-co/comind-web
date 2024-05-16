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
  Skeleton,
  Button,
  SegmentedControl,
} from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { comindContainerWidth } from "@/lib/Configuration";
import { ThoughtContext, ThoughtProvider } from "@/lib/thoughtprovider";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { AuthContext } from "@/lib/authprovider";
import Logo from "@/lib/Logo";
import LogoShort from "@/lib/LogoShort";
import { IconBubble, IconHome } from "@tabler/icons-react";

const Shell = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const { connected, currentMeldSlug } = useContext(ThoughtContext);

  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 50 });
  const navButtonVariant = "default";

  return (
    <>
      <AppShell
        padding="md"
        header={{ height: 80, collapsed: !pinned && !opened }}
        navbar={{
          width: { base: 200 },
          breakpoint: "sm",
          collapsed: { desktop: false, mobile: !opened },
        }}
        aside={{
          width: 200,
          breakpoint: "md",
          collapsed: { desktop: false, mobile: true },
        }}
        footer={{ height: 40 }}
      >
        <AppShell.Header>
          <Container
            size={comindContainerWidth}
            style={{ position: "relative" }}
          >
            <Container
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                right: 0,
                zIndex: 0,
              }}
            >
              {/* Logo */}
              <Center visibleFrom="xs">
                <Logo size={100} />
              </Center>

              {/* Logo small */}
              <Center hiddenFrom="xs">
                <LogoShort size={100} />
              </Center>
            </Container>
            <div
              style={{
                height: 80,
                width: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
            </div>
          </Container>
        </AppShell.Header>

        {/* Navbar */}
        <AppShell.Navbar p="md">
          <Stack justify="space-between" style={{ flex: 1 }} h="100%">
            {isAuthenticated && (
              <Stack>
                <Button component="a" href="/" variant={navButtonVariant}>
                  home
                </Button>
                <Button
                  component="a"
                  href="/thoughts"
                  variant={navButtonVariant}
                >
                  thoughts
                </Button>
                <Button component="a" href="/melds" variant={navButtonVariant}>
                  melds
                </Button>

                <Stack>
                  <Button
                    component="a"
                    href="/logout"
                    variant={navButtonVariant}
                  >
                    logout
                  </Button>
                </Stack>
              </Stack>
            )}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          <Container size={comindContainerWidth}>{children}</Container>
        </AppShell.Main>

        {/* Aside */}
        <AppShell.Aside></AppShell.Aside>

        {/* Footer */}
        <AppShell.Footer p="sm" withBorder={false}>
          {/* Debug for current meld */}
          <Group>
            {/* Connected indicator */}
            {/* <Indicator
              position="middle-start"
              color={connected ? "green" : "red"}
            > */}
            <Pill variant="contrast">
              {connected ? "connected" : "disconnected"}
            </Pill>
            {/* </Indicator> */}
            <Pill variant="subtle">{currentMeldSlug}</Pill>
            <Pill variant="subtle">{username}</Pill>
          </Group>
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

export default Shell;
