"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, List, PlusCircle, User, Settings } from "lucide-react";
import { haptic } from "@/lib/haptic"

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";

type AppLayoutProps = {
  children: ReactNode;
};

const NAV_ITEMS = [
  { value: "home", href: "/app", icon: Home, size: 6 },
  { value: "transactions", href: "/app/transactions", icon: List, size: 6 },
  { value: "register", href: "/app/register", icon: PlusCircle, size: 8 },
  { value: "settings", href: "/app/settings", icon: Settings, size: 6 },
  { value: "profile", href: "/app/profile", icon: User, size: 6 },
] as const;

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const active =
    NAV_ITEMS.find((item) =>
      item.href === "/app"
        ? pathname === item.href || pathname === "/app/"
        : pathname.startsWith(item.href),
    )?.value ?? "home";

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20 px-4 pt-6 bg-background">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t pb-[env(safe-area-inset-bottom)] h-20">
        <Tabs
          value={active}
          onValueChange={(value) => {
            const target = NAV_ITEMS.find((item) => item.value === value);
            if (target) {
              router.push(target.href);
            }
          }}
          className="flex justify-center w-full h-full"
        >
          <TabsList className="relative flex w-full justify-between bg-background h-full pb-8 border-t border-border border-t-background/50">
            {NAV_ITEMS.map(({ value, icon: Icon, size }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 h-full"
                aria-label={value}
                onClick={() => haptic()}
              >
                <Icon className={`size-${size} ${value === active ? "text-dark dark:text-white" : "text-muted-foreground/40 dark:text-muted-foreground"}`} />
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </nav>
    </div>
  );
}

