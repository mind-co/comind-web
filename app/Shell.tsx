import React from "react";
import { AppShell, Container, Text } from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";
import ComindShort from "@/lib/ComindShort";
import { comindContainerWidth } from "@/lib/Configuration";

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell padding="md" header={{ height: 100 }}>
      <AppShell.Header>
        <Container size={comindContainerWidth}>
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            {/* Left box */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Text size="xl">
                <Link href="/">home</Link>
              </Text>
              <Text size="xl">
                <Link href="/thoughts">thoughts</Link>
              </Text>
            </div>

            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "4rem",
              }}
            >
              <ComindShort />
              {/* <Comind /> */}
            </div>

            {/* Right box */}
            <div>
              <Text size="xl">
                <Link href="/melds">melds</Link>
              </Text>
            </div>
          </div>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Container size={comindContainerWidth}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default Shell;
