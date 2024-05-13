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
  primaryColor: "yellow",
});

// Create a provider that wraps the NextUIProvider and AuthProvider
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Dark mode/light mode hooks
  const preferredColorScheme = useColorScheme("light");
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
