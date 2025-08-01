
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
  const { state } = !standalone ? useSidebar() : { state: 'expanded' };
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteName, setSiteName] = useState("OneConversion");

  useEffect(() => {
    const updateLogo = () => {
        const settings = getSiteSettings();
        setLogoUrl(settings.sidebarLogoUrl);
        setSiteName(settings.siteName);
    };
    updateLogo();
    window.addEventListener('siteSettingsChanged', updateLogo);
    return () => window.removeEventListener('siteSettingsChanged', updateLogo);
  }, []);

  return (
    <div className="flex items-center gap-3">
        {logoUrl ? (
             <Image src={logoUrl} alt="Logo" width={40} height={40} className="rounded-lg object-contain" unoptimized/>
        ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
                <MessageSquareCode className="h-6 w-6" />
            </div>
        )}
        <div
        className={cn(
            "text-lg font-bold text-foreground transition-opacity duration-200",
            !standalone && state === "collapsed" ? "opacity-0" : "opacity-100"
        )}
        >
            <span className="text-primary">{siteName.split(' ')[0]}</span>
            {siteName.split(' ').slice(1).join(' ')}
        </div>
    </div>
  );
}
