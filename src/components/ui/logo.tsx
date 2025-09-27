
"use client";

import { MessageSquareCode } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { getSiteSettings } from "@/services/site-settings-service";
import Image from "next/image";

interface LogoProps {
    standalone?: boolean;
}

export default function Logo({ standalone = false }: LogoProps) {
  const sidebarContext = !standalone ? useSidebar() : null;
  const state = sidebarContext?.state || 'expanded';
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const updateLogo = () => {
        const settings = getSiteSettings();
        setLogoUrl(settings.sidebarLogoUrl);
    };
    updateLogo();
    window.addEventListener('siteSettingsChanged', updateLogo);
    return () => window.removeEventListener('siteSettingsChanged', updateLogo);
  }, []);
  
  const isCollapsed = !standalone && state === "collapsed";

  // Don't render until logoUrl has been determined on the client
  if (logoUrl === null && !standalone) {
      return null;
  }

  return (
    <div className={cn("flex items-center justify-start", isCollapsed ? "h-10 w-10 justify-center" : "h-10 w-auto")}>
        {logoUrl ? (
             <Image 
                src={logoUrl} 
                alt="Logo" 
                width={isCollapsed ? 40 : 120} 
                height={40} 
                className={cn(
                    "rounded-lg object-contain transition-all duration-300",
                    isCollapsed ? "w-10 h-10" : "h-10 w-auto"
                )}
                unoptimized
              />
        ) : (
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background", isCollapsed ? "" : "ml-2")}>
                <MessageSquareCode className="h-6 w-6" />
            </div>
        )}
    </div>
  );
}
