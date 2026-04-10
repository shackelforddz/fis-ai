"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ListChecks,
  LayoutList,
  ClipboardList,
  Users,
  LineChart,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: ListChecks, label: "Opportunities", href: "/opportunities" },
  { icon: LayoutList, label: "Covenants", href: "/covenants" },
  { icon: ClipboardList, label: "Documents", href: "/documents" },
  { icon: Users, label: "Borrowers", href: "/borrowers" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
];

export function Nav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col items-center justify-between py-6 px-4 shrink-0", className)}>
      {/* FIS Logo */}
      <div className="mb-8">
        <img src="/FIS-Logo.svg" alt="FIS" width={55} height={23} />
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-4 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip key={item.label}>
              <TooltipTrigger
                className={cn(
                  "flex items-center justify-center size-8 rounded-lg transition-colors cursor-pointer",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
                onClick={() => {
                  window.location.href = item.href;
                }}
              >
                <item.icon className="size-5" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Settings */}
      <Tooltip>
        <TooltipTrigger className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
          <Settings className="size-5" />
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Settings</p>
        </TooltipContent>
      </Tooltip>
    </nav>
  );
}
