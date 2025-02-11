"use client"
import { ShowAuthProvider } from "@/hooks/authPopup";
import { SessionProvider } from "next-auth/react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({children}: HomeLayoutProps) {
  return (
    <SessionProvider>
      <ShowAuthProvider>{children}</ShowAuthProvider>
    </SessionProvider>
  );
}
