"use client";
import { useContext } from "react";
import { LoginPage } from "./login/page";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "./MainPage";

// Main entry point for the application
export default function App() {
  const { username } = useContext(AuthContext);
  return username ? <MainPage /> : <LoginPage />;
}
