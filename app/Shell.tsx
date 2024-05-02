import React from "react";
import { AppShell, Container } from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell padding="md" header={{ height: 30 }}>
      <AppShell.Header>
        <Container size="sm">
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Comind /> - <Link href="/thoughts">thoughts</Link> -{" "}
            <Link href="/melds">melds</Link>
          </div>
        </Container>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Shell;
