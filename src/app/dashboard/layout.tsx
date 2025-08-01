
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { Home, BarChart, ShoppingCart, Settings, LogOut, Paintbrush, Package, Tags, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { GlobalFilterProvider, useGlobalFilter } from "@/contexts/global-filter-context";
import GlobalDateFilter from "@/components/dashboard/global-date-filter";
import { isAuthenticated, logout } from "@/services/auth-service";
import { Button } from "@/components/ui/button";

const menuItems = [
    { path: "/dashboard", icon: Home, label: "Visão Geral" },
    { path: "/dashboard/sales", icon: ShoppingCart, label: "Vendas" },
    { path: "/dashboard/products", icon: Package, label: "Produtos" },
    { path: "/dashboard/analytics", icon: BarChart, label: "Análises" },
    { path: "/dashboard/marketing", icon: Tags, label: "Marketing" },
];

const settingsMenuItems = [
    { path: "/dashboard/personalizacao", icon: Paintbrush, label: "Personalização" },
    { path: "#", icon: Settings, label: "Configurações" },
];

function DashboardHeader() {
    const pathname = usePathname();
    const { onRefresh, isRefreshing } = useGlobalFilter();

    const getPageTitle = () => {
        const activeItem = menuItems.find(item => item.path === pathname) || settingsMenuItems.find(item => item.path === pathname) || { label: "Produtos", path: "/dashboard/products"};
        return activeItem ? activeItem.label : "Dashboard";
    }

    const showGlobalFilter = ["/dashboard", "/dashboard/sales", "/dashboard/analytics"].includes(pathname);
    const showRefreshButton = pathname === "/dashboard/sales";

    return (
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <div className="md:hidden">
                    <SidebarTrigger />
                </div>
                <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Suspense fallback={<div className="h-9 w-64 rounded-md bg-gray-200 animate-pulse" />}>
                    {showGlobalFilter && <GlobalDateFilter />}
                </Suspense>
                {showRefreshButton && (
                     <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                        {isRefreshing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2 h-4 w-4"/>}
                        Atualizar
                    </Button>
                )}
            </div>
        </header>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);
  
  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <GlobalFilterProvider>
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
                                  <Link href={item.path}>
                                      <item.icon />
                                      {item.label}
                                  </Link>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      ))}
                       <SidebarMenuItem>
                          <SidebarMenuButton onClick={handleLogout}>
                            <LogOut />
                            Sair
                          </SidebarMenuButton>
                      </SidebarMenuItem>
                  </SidebarMenu>
              </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 md:p-6">
            <DashboardHeader />
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </GlobalFilterProvider>
  );
}
