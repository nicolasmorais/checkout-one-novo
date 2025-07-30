
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
import { Home, BarChart, ShoppingCart, Settings, LogOut, Paintbrush, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/logo";

const menuItems = [
    { path: "/dashboard", icon: Home, label: "Visão Geral" },
    { path: "/dashboard/sales", icon: ShoppingCart, label: "Vendas" },
    { path: "/dashboard/products", icon: Package, label: "Produtos" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Análises" },
];

const settingsMenuItems = [
    { path: "/dashboard/personalizacao", icon: Paintbrush, label: "Personalização" },
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
    const activeItem = menuItems.find(item => item.path === pathname) || settingsMenuItems.find(item => item.path === pathname) || { label: "Produtos", path: "/dashboard/products"};
    return activeItem ? activeItem.label : "Dashboard";
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent className="p-2">
            <div className="p-2">
              <Logo />
            </div>
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
                                <Link href={item.path === '/' ? '/' : item.path}>
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
