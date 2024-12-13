"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarGroup,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  Bot,
  Key,
  Settings,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  subItems?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  // { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Models", href: "/dashboard/models" },
  { icon: Key, label: "Providers", href: "/dashboard/providers" },
  // { icon: Key, label: "API Keys", href: "/dashboard/apikeys" },
  { icon: Key, label: "Apps", href: "/dashboard/apps" },
  // {
  //   icon: ChevronDown,
  //   label: "Analytics",
  //   subItems: [
  //     {
  //       icon: Key,
  //       label: "Prompt History",
  //       href: "/dashboard/analytics/prompt-history",
  //     },
  //   ],
  // },
];

interface SidebarProps {
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
  children: React.ReactNode;
}

export default function SidebarComponent({ user, children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0]?.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    router.push("/auth");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu className="p-4">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex items-center space-x-2">
                    <div className="flex aspect-square w-8 items-center justify-center rounded-lg bg-[#4285F4] text-white">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block font-bold text-[#1a1a1a]">
                        LLM Gateway
                      </span>
                      <span className="text-xs text-[#666666]">Beta</span>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <SidebarMenu className="space-y-1.5 p-4">
              {sidebarItems.map((item) =>
                item.href ? (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className={cn(
                        "hover:bg-[#4285F4]/10",
                        pathname === item.href &&
                          "bg-[#4285F4]/10 text-[#4285F4]"
                      )}
                    >
                      <Link href={item.href} className="font-bold flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : item.subItems ? (
                  <Collapsible key={item.label} defaultOpen>
                    <SidebarGroup>
                      <SidebarGroupLabel asChild>
                        <CollapsibleTrigger className="flex items-center text-lg hover:bg-gray-200">
                          {item.label}
                          <ChevronDown className="ml-auto transition-transform rotate-0 group-data-[state=open]:rotate-180" />
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={subItem.href}>
                            <SidebarMenuButton
                              asChild
                              className={cn(
                                "hover:bg-[#4285F4]/10",
                                pathname === subItem.href &&
                                  "bg-[#4285F4]/10 text-[#4285F4]"
                              )}
                            >
                              {subItem.href ? (
                                <Link href={subItem.href}>
                                  <subItem.icon className="mr-3 h-4 w-4" />
                                  {subItem.label}
                                </Link>
                              ) : null}
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                ) : null
              )}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="p-4">
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-[#4285F4]/10">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center font-bold"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Separator className="my-4" />

            <div className="flex items-center gap-3 pr-2">
              <Avatar className="h-8 w-8 shrink-0 bg-[#4285F4]/10">
                <AvatarImage src="/avatars/user.png" alt="User" />
                <AvatarFallback>
                  <User className="h-4 w-4 text-[#4285F4]" />
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-[#1a1a1a]">
                  {user.firstname} {user.lastname}
                </span>
                <span className="truncate text-xs text-[#666666]">
                  {user.email}
                </span>
              </div>
            </div>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="mt-2 w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-semibold">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b px-6 justify-between bg-white">
          <SidebarTrigger />
          <h1 className="text-xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">{user.firstname || "User"}</span>!
          </h1>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
