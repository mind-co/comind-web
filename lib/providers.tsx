import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/lib/authprovider";
import { ThemeProvider } from "next-themes";
import { ThoughtProvider } from "./mainwebsocket";
import { useRouter } from "next/navigation";

// Props for the Providers component
interface ProvidersProps {
  children: React.ReactNode;
}

// Create a provider that wraps the NextUIProvider and AuthProvider
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const router = useRouter();

  return (
    <ThemeProvider>
      <NextUIProvider navigate={router.push}>
        <AuthProvider>
          <ThoughtProvider>{children}</ThoughtProvider>
        </AuthProvider>
      </NextUIProvider>
    </ThemeProvider>
  );
};

export default Providers;
