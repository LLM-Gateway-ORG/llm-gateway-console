"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import { getApps } from "@/lib/apps";
import AppListing from "./app-listing";
import { App } from "./types";
import { toast } from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function Apps() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    const fetchedApps = await getApps();
    try {
      setIsLoading(true);
      setApps(
        fetchedApps.map((app) => ({
          id: app.id,
          createdAt: new Date(app.created_at),
          name: app.name,
          type: app.feature_type,
          models_count: app.supported_models.length,
        }))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch Apps");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Apps</h1>
      </div>
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-6 w-[150px]" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-50 dark:bg-red-950/50">
          <p className="font-medium">{error}</p>
        </div>
      ) : (
        <AppListing initialApps={apps} />
      )}
    </div>
  );
}
