import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

import { Lexend_Deca } from "next/font/google";
import Providers from "@/lib/providers";
import { useColorScheme } from "@mantine/hooks";
import { useState } from "react";

// Metadata
export const metadata = {
  title: "Comind",
  description: "think good thoughts",
};

// const inter = Inter({ subsets: ["latin"] });
// const roboto_mono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
// });
const core_font = Lexend_Deca({
  // const core_font = Outfit({
  // const core_font = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={core_font.className}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Providers>{children}</Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
