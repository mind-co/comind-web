import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "./globals.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";

import { Lexend_Deca } from "next/font/google";
import Providers from "@/lib/providers";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={core_font.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
