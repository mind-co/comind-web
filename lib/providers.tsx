import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "@/lib/authprovider";

// Props for the Providers component
interface ProvidersProps {
  children: React.ReactNode;
}

// Create a provider that wraps the NextUIProvider and AuthProvider
const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <NextUIProvider>
      <AuthProvider>{children}</AuthProvider>
    </NextUIProvider>
  );
};

export default Providers;
