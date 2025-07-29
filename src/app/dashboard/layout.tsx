
"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, BarChart, ShoppingCart, Users, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { path: "/dashboard", icon: Home, label: "Visão Geral" },
    { path: "/dashboard/sales", icon: ShoppingCart, label: "Vendas" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Análises" },
    { path: "/dashboard/users", icon: Users, label: "Usuários" },
];

const bottomMenuItems = [
    { path: "/dashboard/settings", icon: Settings, label: "Configurações" },
    { path: "/", icon: LogOut, label: "Sair" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getPageTitle = () => {
    const activeItem = menuItems.find(item => item.path === pathname);
    return activeItem ? activeItem.label : "Dashboard";
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5 flex items-center justify-center">
              <BarChart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Dashboard</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link href={item.path}>
                            <item.icon />
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {bottomMenuItems.map(item => (
                <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive(item.path)}>
                        <Link href={item.path === '/' ? '/' : '#'}>
                            <item.icon />
                            {item.label}
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 md:p-6">
          <header className="flex items-center justify-between mb-6">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <h1 className="text-2xl font-bold hidden md:block">{getPageTitle()}</h1>
          </header>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
