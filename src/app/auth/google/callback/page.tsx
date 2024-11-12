"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { handleAuthTokens } from "@/lib/utils";
import { handleGoogleCallback } from "@/lib/auth/google";
import { Icons } from "@/components/icons";

// Create a separate component for the callback logic
function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const code = searchParams.get("code");
      if (code) {
        const data = await handleGoogleCallback(code);
        if (data?.jwt_tokens && handleAuthTokens(data.jwt_tokens)) {
          router.push("/dashboard");
        } else {
          router.push("/auth");
        } 
      }
    };

    fetchData();
  }, [router, searchParams]);

  return null;
}

// Main component
export default function GoogleCallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            {Icons.googleCallback}
          </div>
          <CardTitle className="text-2xl text-center">
            Google Authentication
          </CardTitle>
          <CardDescription className="text-center">
            Please wait while we complete your sign in...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4 pb-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">
            You will be redirected automatically
          </p>
        </CardContent>
      </Card>
      <Suspense fallback={null}>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
