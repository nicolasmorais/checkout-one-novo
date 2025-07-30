
"use client";

import { MessageSquareCode } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function Logo() {
  const { state } = useSidebar();

  return (
    <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground text-background">
            <MessageSquareCode className="h-6 w-6" />
        </div>
        <div
        className={cn(
            "text-lg font-bold text-foreground transition-opacity duration-200",
            state === "collapsed" ? "opacity-0" : "opacity-100"
        )}
        >
            <span className="text-primary">One</span>Conversion
        </div>
    </div>
  );
}
