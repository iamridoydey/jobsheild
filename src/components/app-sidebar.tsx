"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Plus, Building2, CircleGauge } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import jobsheildLogo from "@/public/jobsheild_logo.svg";
import { NavUser } from "./nav-user";
import { useAuthPopup } from "@/hooks/authPopup";
import { useSession } from "next-auth/react";

// Sample data
const items = [
  {
    title: "Fraud Companies",
    icon: Building2,
    mode: "view",
    url: "/fraud_companies",
  },
  {
    title: "Add Fraud Company",
    icon: Plus,
    mode: "create",
    url: "/add_fraud_company",
  },
  {
    title: "Dashboard",
    icon: CircleGauge,
    mode: "dashboard",
    url: "/dashboard",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, setOpen, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Get the current pathname
  const pathname = usePathname();

  // Get access to the user
  const { data: session } = useSession();

  // If there is user login we will show the full navbar items
  // otherwise just show the fraud_companies
  // Filter items based on session
  const filteredItems = session
    ? items
    : items.filter((item) => item.url === "/fraud_companies");

  const { showAuthPopup, setAuthPopup } = useAuthPopup();

  // Collapse the sidebar if showAuthPopup is true
  React.useEffect(() => {
    if (showAuthPopup) {
      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }
    }
  }, [showAuthPopup, setOpen, isMobile, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Header */}
      <SidebarHeader className="px-3">
        <Link href="/" className="flex items-center">
          {/* Logo */}
          <Image
            src={jobsheildLogo}
            alt="JobShield Logo"
            className="h-9 w-9 shrink-0"
          />

          {/* Title */}
          <h2
            className={`title font-bold text-2xl ml-2 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            JobShield
          </h2>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent>
        <SidebarMenu className="mt-4 ">
          {filteredItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={`${item.url}`}
                  className={`flex items-center gap-3 px-3 py-6 hover:text-gray-600 hover:bg-transparent ${
                    pathname === item.url ? "text-zinc-800 font-bold" : ""
                  }`}
                >
                  <span className="iconWrapper">
                    <item.icon />
                  </span>
                  <span
                    className={`font-semibold text-[16px] ${
                      isCollapsed ? "hidden" : ""
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        {session ? (
          <NavUser
            user={{
              name: session.user?.name || "",
              email: session.user?.email || "",
              avatar: "user_avatar.svg",
            }}
          />
        ) : (
          <button
            onClick={() => setAuthPopup(true)}
            className="text-center ml-2 border-2 border-zinc-800 rounded-lg text-lg hover:text-white hover:border-white transition-all 3s shadow-lg bg-red-400"
          >
            Sign In
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
