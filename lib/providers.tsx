"use client";
import React, { useState } from "react";
// import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/lib/authprovider";
import { ThemeProvider } from "next-themes";
import { ThoughtProvider } from "./thoughtprovider";
import { useColorScheme } from "@mantine/hooks";
import { MantineProvider } from "@mantine/core";
import ColorSchemeContext from "./ColorSchemeContext";

// Props for the Providers component
interface ProvidersProps {
  children: React.ReactNode;
}

// Create a provider that wraps the NextUIProvider and AuthProvider
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Dark mode/light mode hooks
  const preferredColorScheme = useColorScheme("dark");
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);

  return (
    <ThemeProvider>
      <MantineProvider>
        <AuthProvider>
          <ThoughtProvider>{children}</ThoughtProvider>
        </AuthProvider>
      </MantineProvider>
    </ThemeProvider>
  );
};

export default Providers;
