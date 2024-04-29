import React from "react";
import { AppShell, Container } from "@mantine/core";
import Comind from "@/lib/comind";
import Link from "next/link";

const Shell = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppShell padding="md" header={{ height: 50 }}>
      <AppShell.Header>
        <Container size="sm">
          <Comind /> - <Link href="/thoughts">thoughts</Link> -{" "}
          <Link href="/melds">melds</Link>
        </Container>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Shell;
