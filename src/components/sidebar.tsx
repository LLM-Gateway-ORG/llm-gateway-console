"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Bot, Key, LayoutDashboard, Settings, LogOut, User } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Bot, label: "Models", href: "/models" },
  { icon: Bot, label: "Playground", href: "/playground" },
  { icon: Key, label: "API Keys", href: "/api-keys" },
]

interface SidebarProps {
  user: {
    firstname: string;
    lastname: string;
    email: string;
  };
}

export default function SidebarComponent({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear()
    
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })

    // Redirect to auth page
    router.push('/auth')
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r bg-white">
        <SidebarHeader>
          <SidebarMenu className="p-4">
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[#4285F4] text-white">
                    <Bot className="size-4" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-[#1a1a1a]">LLM Gateway</span>
                    <span className="text-xs text-[#666666]">v1.0.0</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <SidebarMenu className="space-y-1.5 p-4">
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    className={cn(
                      "hover:bg-[#4285F4]/10",
                      pathname === item.href && "bg-[#4285F4]/10 text-[#4285F4]"
                    )}
                  >
                    <Link href={item.href} className="font-bold">
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu className="p-4">
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="hover:bg-[#4285F4]/10"
              >
                <Link href="/dashboard/settings" className="flex items-center font-bold">
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
    </SidebarProvider>
  )
}