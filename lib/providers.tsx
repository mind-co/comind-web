"use client";
import React, { useState } from "react";
// import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/lib/authprovider";
import { ThoughtProvider } from "./thoughtprovider";
import { useColorScheme } from "@mantine/hooks";
import {
  MantineProvider,
  MantineThemeOverride,
  createTheme,
} from "@mantine/core";
import ColorSchemeContext from "./ColorSchemeContext";

// Props for the Providers component
interface ProvidersProps {
  children: React.ReactNode;
}

// Make the theme
const theme = createTheme({
  colors: {
    comind: [
      "rgb(var(--comind-primary-rgb))",
      "rgb(var(--comind-secondary-rgb))",
      "rgb(var(--comind-tertiary-rgb))",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
      "var(--mantine-color-text)",
    ],
  },
  primaryColor: "comind",
  defaultRadius: "lg",
});

// Create a provider that wraps the NextUIProvider and AuthProvider
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Dark mode/light mode hooks
  const preferredColorScheme = useColorScheme("dark");
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);

  return (
    <AuthProvider>
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        <ThoughtProvider>{children}</ThoughtProvider>
      </MantineProvider>
    </AuthProvider>
  );
};

export default Providers;
