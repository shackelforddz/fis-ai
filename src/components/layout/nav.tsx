"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ListChecks,
  LayoutList,
  ClipboardList,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: ListChecks, label: "Opportunities", href: "/opportunities" },
  { icon: LayoutList, label: "Risks", href: "/risks" },
  { icon: ClipboardList, label: "Loan Evaluation", href: "/loan-evaluation" },
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
                render={<Link href={item.href} />}
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

      {/* Avatar */}
      <Tooltip>
        <TooltipTrigger className="rounded-full cursor-pointer">
          <Avatar className="size-12">
            <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="David Shackelford" />
            <AvatarFallback>DS</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Account</p>
        </TooltipContent>
      </Tooltip>
    </nav>
  );
}
