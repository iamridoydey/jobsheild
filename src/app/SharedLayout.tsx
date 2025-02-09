"use client"
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import createApolloClient from "@/lib/apolloClient";
import { ApolloProvider } from "@apollo/client";
import { cn } from "@/lib/utils"; 
import { ShowAuthProvider } from "@/hooks/authPopup";
import AuthPopupHandler from "@/components/auth/AuthPopupHandler";
import { SessionProvider } from "next-auth/react";

interface SharedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function SharedLayout({
  className,
  children,
}: SharedLayoutProps) {
  const apolloClient = createApolloClient(); 
  return (
    <ApolloProvider client={apolloClient}>
      <SessionProvider>
        <SidebarProvider>
          <ShowAuthProvider>
            <AppSidebar />
            <div className="w-full bg-red-300 relative">
              <SidebarTrigger className="text-black font-bold bg-gray-400 top-0 left-0 sticky" />
              <div className={cn("pages_wrapper", className)}>{children}</div>
            </div>
            <AuthPopupHandler />
          </ShowAuthProvider>
        </SidebarProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
