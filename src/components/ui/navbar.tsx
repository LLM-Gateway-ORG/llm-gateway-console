"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, User } from "lucide-react"
import Link from "next/link"

interface NavbarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="w-full px-2">
        <div className="flex h-14 items-center justify-between">
          {/* Left side - Logo and Company Name */}
          <div className="flex items-center pl-2">
            <Link 
              href="/" 
              className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            >
              <Brain className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-lg text-gray-900">LLM Gateway</span>
            </Link>
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center pr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-9 w-9 rounded-full hover:bg-gray-100"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 hover:bg-red-50">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}