"use client";
import { useContext } from "react";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "./MainPage";
import { redirect } from "next/navigation";
import { Loading } from "@/lib/loading";

// Main entry point for the application
export default function App() {
  const { username, isLoading } = useContext(AuthContext);

  // Wait on loading
  // if (isLoading) {
  //   return <Loading />;
  // }

  // If we aren't logged in, redirect to the login page
  if (!username) {
    return redirect("/login");
  }

  // If we are logged in, show the main page
  return <MainPage />;
}
