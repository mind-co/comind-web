"use client";
import type { Metadata } from "next";
import { IBM_Plex_Sans, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import "./markdown.css";
import Providers from "@/lib/providers";

// const inter = Inter({ subsets: ["latin"] });
// const roboto_mono = Roboto_Mono({
//   subsets: ["latin"],
//   display: "swap",
// });
const plex_sans = IBM_Plex_Sans({
  weight: ["400"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plex_sans.className + " dark"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
