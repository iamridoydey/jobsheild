import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ActiveFrauderModeProvider } from "@/hooks/ActiveFrauderMode";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ActiveFrauderModeProvider>
      <SidebarProvider>
        <AppSidebar />
        <div className="h-screen w-full bg-red-300">
          <SidebarTrigger className="text-black font-bold bg-gray-400" />
          {children}
        </div>
      </SidebarProvider>
    </ActiveFrauderModeProvider>
  );
}
