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

// Sample data
const items = [
  {
    title: "Fraud Companies",
    url: "#",
    icon: Building2,
    isActive: true,
  },
  {
    title: "Add New Frauder",
    url: "#",
    icon: Plus,
  },
];

const user = {
  name: "Prite Dey",
  email: "prite@example.com",
  avatar: "user_avatar.svg",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state == "collapsed";
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
                <a
                  href={item.url}
                  className={`flex items-center gap-3 px-3 py-6 hover:bg-gray-400 hover:text-gray-100`}
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
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter>
        <NavUser user={user}/>
      </SidebarFooter>
    </Sidebar>
  );
}
