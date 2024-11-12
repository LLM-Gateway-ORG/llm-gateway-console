"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Linkedin, MessageSquare, Check, Calendar, ArrowRight, Zap, Shield, Cpu } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/dist/server/api-utils";

export default function LandingPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup submitted:", email);
    toast({
      title: "Thanks for joining the waitlist!",
      description: "We'll keep you updated on LLM Gateway's launch.",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-6 pt-20 pb-20 text-center lg:pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full mb-8">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Now in Beta</span>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl">
              One API Key for
              <span className="text-blue-600"> All AI Models</span>
            </h1>
            
            <p className="mt-6 text-lg text-slate-600 max-w-3xl mx-auto">
              Unify your AI stack with a single API. Access OpenAI, Groq, Anthropic, and more through 
              one seamless integration. Save time, reduce complexity, and build faster.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl"
                onClick={() => {
                  window.location.href = "/auth";
                }}
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-xl"
                onClick={() => window.open("https://cal.com/subhomoy-roy-choudhury/llm-gateway-demo", "_blank")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Logos Grid */}
        {/* Add code here for Carousel using swiper */}
        {/* Add partner logos here */}
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Cpu className="h-8 w-8 text-blue-600" />,
                title: "Unified API Access",
                description: "One API key to access all major AI providers. Simplify your integration and reduce complexity."
              },
              {
                icon: <Shield className="h-8 w-8 text-blue-600" />,
                title: "Enterprise Security",
                description: "Bank-grade encryption and security measures to protect your data and API keys."
              },
              {
                icon: <Zap className="h-8 w-8 text-blue-600" />,
                title: "Real-time Switching",
                description: "Switch between providers instantly without changing your code."
              }
            ].map((feature, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-4 rounded-lg bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  {feature.icon}
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative py-16 px-8">
            <div className="relative max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Stay updated with the latest features and announcements from our unified AI API platform.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <Input
                  disabled
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-12 text-lg rounded-xl bg-white/10 text-white placeholder:text-blue-100"
                  required
                />
                <Button 
                  type="submit"
                  disabled
                  className="h-12 px-8 bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-medium"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <p className="text-slate-500">&copy; 2024 LLM Gateway. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-slate-500">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
