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
  rem,
  UnstyledButton,
  Badge,
  Center,
  Stack,
  Skeleton,
  Button,
  SegmentedControl,
  ButtonGroup,
} from "@mantine/core";
import Comind from "@/lib/comind";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { comindContainerWidth } from "@/lib/Configuration";
import { ThoughtContext, ThoughtProvider } from "@/lib/thoughtprovider";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { AuthContext } from "@/lib/authprovider";
import Logo from "@/lib/Logo";
import LogoShort from "@/lib/LogoShort";
import {
  IconAffiliate,
  IconBubble,
  IconDashboard,
  IconFileText,
  IconHome,
  IconLogout,
  IconSearch,
} from "@tabler/icons-react";

const actions: SpotlightActionData[] = [
  {
    id: "home",
    label: "Home",
    description: "Get to home page",
    onClick: () => console.log("Home"),
    leftSection: (
      <IconHome style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  },
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Get full information about current system status",
    onClick: () => console.log("Dashboard"),
    leftSection: (
      <IconDashboard style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  },
  {
    id: "documentation",
    label: "Documentation",
    description: "Visit documentation to lean more about all features",
    onClick: () => console.log("Documentation"),
    leftSection: (
      <IconFileText style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
    ),
  },
];

const Shell = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, username } = useContext(AuthContext);
  const { connected, currentMeldSlug } = useContext(ThoughtContext);

  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 50 });
  const navButtonVariant = "subtle";
  const navButtonColor = "gray";
  const navButtonJustify = "start";
  const iconSize = 16;

  const asideAndNavbarWidth = {
    sm: 150,
    base: 200,
    lg: 250,
  };

  return (
    <>
      {/* Spotlight */}
      <Spotlight
        actions={actions}
        highlightQuery
        transitionProps={{ duration: 0 }}
        searchProps={{
          leftSection: (
            <IconSearch
              style={{ width: rem(20), height: rem(20) }}
              stroke={1.5}
            />
          ),
          placeholder: "Search...",
        }}
      />

      <AppShell
        padding="md"
        header={{ height: 100, collapsed: !pinned && !opened }}
        navbar={{
          width: asideAndNavbarWidth,
          breakpoint: "sm",
          collapsed: { desktop: false, mobile: !opened },
        }}
        aside={{
          width: asideAndNavbarWidth,
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
                <Logo size={125} />
              </Center>

              {/* Logo small */}
              <Center hiddenFrom="xs">
                <LogoShort size={125} />
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
              <ButtonGroup orientation="vertical">
                <Button
                  component="a"
                  href="/"
                  variant={navButtonVariant}
                  color={navButtonColor}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconHome size={iconSize} />}
                >
                  home
                </Button>
                <Button
                  component="a"
                  href="/thoughts"
                  variant={navButtonVariant}
                  color={navButtonColor}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconBubble size={iconSize} />}
                >
                  thoughts
                </Button>
                <Button
                  component="a"
                  href="/melds"
                  variant={navButtonVariant}
                  color={navButtonColor}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconAffiliate size={iconSize} />}
                >
                  melds
                </Button>

                <Button
                  component="a"
                  href="/logout"
                  variant={navButtonVariant}
                  color={navButtonColor}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconLogout size={iconSize} />}
                >
                  logout
                </Button>
              </ButtonGroup>
            )}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Main>
          {children}
          {/* <Container size={comindContainerWidth}>{children}</Container> */}
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
