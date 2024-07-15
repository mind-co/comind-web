// "use client";
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
  ActionIcon,
  Space,
  Title,
  Divider,
} from "@mantine/core";
import Comind from "@/lib/comind";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { asideAndNavbarWidth, comindContainerWidth } from "@/lib/Configuration";
import { ThoughtContext, ThoughtProvider } from "@/lib/thoughtprovider";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { AuthContext } from "@/lib/authprovider";
import Logo from "@/lib/Logo";
import LogoShort from "@/lib/LogoShort";
import {
  IconAffiliate,
  IconBubble,
  IconBurger,
  IconCircles,
  IconDashboard,
  IconFileText,
  IconHome,
  IconLogout,
  IconSearch,
  IconSettings,
  IconSphere,
  IconX,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

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
  const { connected, currentMeldSlug, retrying } = useContext(ThoughtContext);

  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 500 });
  const navButtonVariant = "subtle";
  const navButtonColor = "gray";
  const navButtonJustify = "start";
  const iconSize = 16;

  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getNavButtonVariant = (path: string) => {
    return isActive(path) ? "filled" : navButtonVariant;
  };

  const getNavButtonColor = (path: string) => {
    return isActive(path) ? "gray" : navButtonColor;
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
        header={{
          height: 65,
        }}
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
        <AppShell.Header pos="relative" withBorder={false}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              padding: 0,
              margin: 10,
              display: "flex",
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

          <Container size="xl">
            <Center hiddenFrom="xs">
              <LogoShort size={80} />
            </Center>

            <Center visibleFrom="xs">
              <Logo size={80} />
            </Center>
          </Container>
          {/* Empty space for right side
                This doesn't center very well.
                Need something better.
              */}
        </AppShell.Header>

        {/* Navbar */}
        <AppShell.Navbar p="md" withBorder={false}>
          {/* <Container size="xl" h="100%" w={asideAndNavbarWidth}> */}
          <Stack h="100%" w="100%" align="end">
            {/* Logo stack */}
            {/* <Center visibleFrom="lg">
              <LogoShort size={80} />
            </Center>
            <Center visibleFrom="sm" hiddenFrom="lg">
              <LogoShort size={60} />
            </Center>
            <Center visibleFrom="xs" hiddenFrom="sm" w="100%">
              <Logo size={40} />
            </Center> */}

            {isAuthenticated && (
              <ButtonGroup orientation="vertical" w="100%">
                <Button
                  w="100%"
                  component="a"
                  href="/"
                  variant={getNavButtonVariant("/")}
                  color={getNavButtonColor("/")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconHome size={iconSize} />}
                >
                  home
                </Button>
                <Button
                  w="100%"
                  component="a"
                  href="/thoughts"
                  variant={getNavButtonVariant("/thoughts")}
                  color={getNavButtonColor("/thoughts")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconBubble size={iconSize} />}
                >
                  thoughts
                </Button>
                <Button
                  component="a"
                  href="/melds"
                  variant={getNavButtonVariant("/melds")}
                  color={getNavButtonColor("/melds")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconAffiliate size={iconSize} />}
                >
                  melds
                </Button>

                <Button
                  component="a"
                  href="/spheres"
                  variant={getNavButtonVariant("/spheres")}
                  color={getNavButtonColor("/spheres")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconSphere size={iconSize} />}
                >
                  spheres
                </Button>

                <Divider my="md" />
                <Button
                  component="a"
                  href="/settings"
                  variant={getNavButtonVariant("/settings")}
                  color={getNavButtonColor("/settings")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconSettings size={iconSize} />}
                  disabled={true}
                >
                  settings
                </Button>
                <Button
                  component="a"
                  href="/logout"
                  variant={getNavButtonVariant("/logout")}
                  color={getNavButtonColor("/logout")}
                  justify={navButtonJustify}
                  classNames={{ label: "navButton" }}
                  leftSection={<IconLogout size={iconSize} />}
                >
                  logout
                </Button>
              </ButtonGroup>
            )}
          </Stack>
          {/* </Container> */}
        </AppShell.Navbar>
        <AppShell.Main pt={0}>
          {/* {children} */}
          <Container size={comindContainerWidth}>{children}</Container>
        </AppShell.Main>

        {/* Aside */}
        <AppShell.Aside withBorder={false}>
          <Stack h="100%" w="100%" align="end"></Stack>
        </AppShell.Aside>

        {/* Footer */}
        <AppShell.Footer p="sm">
          {/* Debug for current meld */}
          <Group justify="end">
            {/* Connected indicator */}
            {/* <Indicator
              position="middle-start"
              color={connected ? "green" : "red"}
            > */}
            {/* </Indicator> */}
            {/* <Badge variant="subtle">{currentMeldSlug}</Badge> */}
            {/* <Badge variant="subtle">{username}</Badge> */}
            <Badge
              variant="outline"
              color={connected ? "green" : retrying ? "yellow" : "red"}
            >
              {connected
                ? "connected"
                : retrying
                ? "connecting"
                : "disconnected"}
            </Badge>
          </Group>
        </AppShell.Footer>
      </AppShell>
    </>
  );
};

export default Shell;
