"use client";
import { useContext } from "react";
import { AuthContext } from "@/lib/authprovider";
import MainPage from "./MainPage";
import { redirect } from "next/navigation";
import { Loading } from "@/lib/loading";
import Comind from "@/lib/comind";

// Main entry point for the application
export default function App() {
  const { username, token, isLoading } = useContext(AuthContext);

  // Wait on loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>
          <Comind /> is thinking. not very hard.
        </p>
      </div>
    );
  }

  // If we aren't logged in, redirect to the login page
  if (!token) {
    return redirect("/login");
  }

  // If we are logged in, show the main page
  return <MainPage />;
}
