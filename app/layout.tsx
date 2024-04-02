"use client";
import type { Metadata } from "next";
import {
  Comfortaa,
  IBM_Plex_Sans,
  Inter,
  Josefin_Sans,
  Lato,
  Lexend_Deca,
  Montserrat,
  Open_Sans,
  Outfit,
  Raleway,
  Roboto,
  Roboto_Mono,
} from "next/font/google";
import "./globals.css";
import "./markdown.css";
import Providers from "@/lib/providers";

// const inter = Inter({ subsets: ["latin"] });
// const roboto_mono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
// });
const core_font = Lexend_Deca({
  // const core_font = Outfit({
  // const core_font = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={core_font.className + " dark"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
