"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatInterfaceProps {
  theme: string;
  buttonColor: string;
  welcomeMessage: string;
  aiName: string;
  colorPalette: { primary: string; secondary: string; accent: string };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="icon" disabled={pending}>
      <Send className="h-4 w-4" />
      <span className="sr-only">Send message</span>
    </Button>
  );
}

const ChatSideBarMenu = () => {
  return (
    <>
      <SidebarMenuItem key="">
        <SidebarMenuButton
          asChild
        //   isActive={pathname === "/chat"}
        //   className={cn(
        //     "hover:bg-[#4285F4]/10",
        //     pathname === "/chat" && "bg-[#4285F4]/10 text-[#4285F4]"
        //   )}
        >
          <Link href={"/chat"} className="font-bold flex items-center">
            {/* <Add className="mr-3 h-4 w-4" /> */}
            Start Chat 
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
};

export function ChatInterface({
  theme,
  welcomeMessage,
  aiName,
}: ChatInterfaceProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: welcomeMessage },
  ]);

  async function handleSubmit(formData: FormData) {
    const userMessage = formData.get("message") as string;
    if (!userMessage.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `This is a simulated response to: "${userMessage}"`,
        },
      ]);
    }, 1000);

    formData.set("message", "");
  }

  const User = {
    firstname: "ABC",
    lastname: "ABC",
    email: "emial@email.com",
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-[-webkit-fill-available]">
      <div className="flex flex-1">
        <Sidebar user={User} CustomSidebarMenu={<ChatSideBarMenu />}>
          <div
            className={`flex h-screen w-[inherit] h-[-webkit-fill-available] ${
              theme === "dark" ? "dark" : ""
            }`}
          >
            <div className="flex-1 flex flex-col bg-background">
              {/* <header className="flex items-center h-16 px-4 border-b">
                <h1 className="ml-4 text-lg font-semibold">
                  Chat with {aiName}
                </h1>
              </header> */}
              <ScrollArea className="flex-grow py-10 px-[6rem]">
                {messages.map((message, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <div className="flex items-start space-x-2">
                      <Avatar>
                        <AvatarFallback>
                          {message.role === "user" ? "U" : "AI"}
                        </AvatarFallback>
                        <AvatarImage
                          src={
                            message.role === "user"
                              ? "/user-avatar.png"
                              : "/ai-avatar.png"
                          }
                        />
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">
                          {message.role === "user" ? "You" : aiName}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-blue-100 text-blue-900"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <footer className="sticky bottom-0 z-100 bg-white pt-4 pb-10 px-[6rem]">
                <form action={handleSubmit} className="flex space-x-2">
                  <Input
                    type="text"
                    name="message"
                    placeholder="Send a message..."
                    className="flex-grow border-gray-300"
                  />
                  <SubmitButton />
                </form>
              </footer>
            </div>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
