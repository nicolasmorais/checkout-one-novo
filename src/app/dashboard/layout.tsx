
"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
} from "@/components/ui/sidebar";
import { Home, BarChart, ShoppingCart, Users, Settings, LogOut, User, Bell, Building, Paintbrush } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { path: "/dashboard", icon: Home, label: "Visão Geral" },
    { path: "/dashboard/sales", icon: ShoppingCart, label: "Vendas" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Análises" },
    { path: "/dashboard/users", icon: Users, label: "Usuários" },
];

const settingsMenuItems = [
    { path: "#", icon: User, label: "Perfil" },
    { path: "#", icon: Bell, label: "Notificações" },
    { path: "#", icon: Building, label: "Organizações" },
    { path: "#", icon: Paintbrush, label: "Personalização" },
    { path: "#", icon: Settings, label: "Configurações" },
    { path: "/", icon: LogOut, label: "Sair" },
]

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
    const activeItem = menuItems.find(item => item.path === pathname) || settingsMenuItems.find(item => item.path === pathname);
    return activeItem ? activeItem.label : "Dashboard";
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
            <SidebarGroup>
                <SidebarGroupLabel>PRINCIPAL</SidebarGroupLabel>
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
            </SidebarGroup>
            <SidebarGroup>
                <SidebarGroupLabel>CONFIGURAÇÕES</SidebarGroupLabel>
                <SidebarMenu>
                     {settingsMenuItems.map(item => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={isActive(item.path)}>
                                <Link href={item.path === '/' ? '/' : '#'}>
                                    <item.icon />
                                    {item.label}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
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
