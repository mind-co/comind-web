"use client";
import { useContext } from "react";
import { LoginPage } from "./login/page";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "./MainPage";
import { redirect } from "next/navigation";

// Main entry point for the application
export default function App() {
  const { username } = useContext(AuthContext);

  // If we aren't logged in, redirect to the login page
  if (!username) {
    return redirect("/login");
  }

  // If we are logged in, show the main page
  // return <MainPage />;
}
