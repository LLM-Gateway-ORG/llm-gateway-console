import React from "react";
import { ChatInterface } from "./chat-interface";
import type { Metadata } from "next";

// Define interfaces for our data structures
interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
}

interface SidebarItem {
  name: string;
  icon: string;
}

interface ChatData {
  theme: "light" | "dark";  // Restrict theme to specific values
  buttonColor: string;
  welcomeMessage: string;
  aiName: string;
  sidebarItems: SidebarItem[];
  colorPalette: ColorPalette;
  metadata: {
    title: string;
    description: string;
  };
}

// Type the getData function with a return type
async function getData(): Promise<ChatData> {
  return {
    theme: "light",
    buttonColor: "blue",
    welcomeMessage: "Welcome to AI Chat! How can I assist you today?",
    aiName: "AI Assistant",
    sidebarItems: [
      { name: "ChatGPT", icon: "MessageSquare" },
      { name: "GateGPT", icon: "Lock" },
      { name: "Spiritual GPT", icon: "Sun" },
      { name: "Explore GPTs", icon: "Compass" },
    ],
    colorPalette: {
      primary: "#60a5fa",
      secondary: "#93c5fd",
      accent: "#3b82f6",
    },
    metadata: {
      title: "AI Chat Interface",
      description: "An intelligent chat interface powered by AI",
    },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getData();
  return {
    title: data.metadata.title,
    description: data.metadata.description,
  };
}

// // Define props interface for ChatInterface component
// interface ChatInterfaceProps {
//   theme: ChatData["theme"];
//   buttonColor: string;
//   welcomeMessage: string;
//   aiName: string;
//   colorPalette: ColorPalette;
// }

export default async function Home() {
  const data = await getData();

  return (
    <main className="flex min-h-screen">
      <ChatInterface
        theme={data.theme}
        buttonColor={data.buttonColor}
        welcomeMessage={data.welcomeMessage}
        aiName={data.aiName}
        colorPalette={data.colorPalette}
      />
    </main>
  );
}