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
  // SidebarGroupContent,
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
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Activity,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Models", href: "/dashboard/models" },
  { icon: Key, label: "Providers", href: "/dashboard/providers" },
  { icon: Key, label: "API Keys", href: "/dashboard/apikeys" },
  {
    icon: Activity,
    label: "Analytics",
    subItems: [
      {
        icon: Key,
        label: "Prompt History",
        href: "/dashboard/analytics/prompt-history",
      },
    ],
  },
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
    // Clear localStorage
    localStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name =
        eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // Redirect to auth page
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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#4285F4] text-white">
                    <Bot className="size-4" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-[#1a1a1a]">
                      LLM Gateway
                    </span>
                    <span className="text-xs text-[#666666]">Beta</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <SidebarMenu className="space-y-1.5 p-4">
              {sidebarItems.map((item) => {
                // If item has href, render as a link
                if (item?.href) {
                  return (
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
                        <Link
                          href={item.href}
                          className="font-bold flex items-center"
                        >
                          <item.icon className="mr-3 h-4 w-4" />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                // If item is a collapsible section
                if (item?.subItems) {
                  return (
                    <Collapsible
                      key={item.label}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarGroup>
                        <SidebarGroupLabel asChild>
                          <CollapsibleTrigger className="flex items-center text-lg hover:bg-gray-200">
                            {item.label}
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
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
                                <Link
                                  href={subItem.href}
                                  className="font-bold flex items-center"
                                >
                                  <subItem.icon className="mr-3 h-4 w-4" />
                                  {subItem.label}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                        </CollapsibleContent>
                      </SidebarGroup>
                    </Collapsible>
                  );
                }

                // Default case
                return null;
              })}
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
          {/* Add your header content here */}
          <h1 className="text-xl font-bold text-gray-800">
            Welcome back,{" "}
            <span className="text-blue-600">{user.firstname || "User"}</span>!
          </h1>
        </header>
        {/* Add your main content here */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
