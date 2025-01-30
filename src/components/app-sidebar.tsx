"use client";

import * as React from "react";
import { Plus, Building2 } from "lucide-react";
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
import useFrauderMode from "@/hooks/ActiveFrauderMode";

// Sample data
const items = [
  {
    title: "Fraud Companies",
    icon: Building2,
    mode: "view",
  },
  {
    title: "Add New Frauder",
    icon: Plus,
    mode: "create",
  },
];

const user = {
  name: "Prite Dey",
  email: "prite@example.com",
  avatar: "user_avatar.svg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state == "collapsed";
  const { activeMode, setActiveMode } = useFrauderMode();

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
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <Link
                  href={""}
                  className={`flex items-center gap-3 px-3 py-6 hover:bg-gray-500 hover:text-gray-100 ${
                    activeMode === item.mode ? "bg-zinc-300" : ""
                  }`}
                  onClick={() => setActiveMode(item.mode)}
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
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
