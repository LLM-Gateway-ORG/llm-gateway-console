"use client";

import { getAppDetails } from "@/lib/apps";
import type { AppDetails } from "@/types/apps";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeatureTypes } from "../constants";
import { getAIModels } from "@/lib/providers";
import { MultiSelectOption } from "../types";
import { Icons } from "@/components/icons";
import { TabsMapping as SDKTabMapping } from "../sdk/constants";
import SdkAppForm from "../sdk/form-builder";
import { TabsMapping as WebUITabsMapping } from "../webui/constants";
import WebUIAppForm from "../webui/form-builder";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function AppDetails() {
  const searchParams = useParams();
  const id = searchParams.id as string;
  const [appDetails, setAppDetails] = useState<AppDetails | null>(null);
  const [models, setModels] = useState<MultiSelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch AI Models
  const fetchModels = useCallback(async () => {
    try {
      const { models: fetchedModels } = await getAIModels();
      return fetchedModels
        .filter((model) => model.active)
        .map((model) => ({
          value: model.model_name,
          label: model.model_name,
        }));
    } catch (error) {
      console.error("Failed to fetch models:", error);
      return [];
    }
  }, []);

  // Fetch App Details
  const fetchAppDetails = useCallback(async (appId: string) => {
    try {
      return await getAppDetails(appId);
    } catch (error) {
      console.error("Failed to fetch app details:", error);
      return null;
    }
  }, []);

  // Combine Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (id) {
        const [modelsData, appDetailsData] = await Promise.all([
          fetchModels(),
          fetchAppDetails(id),
        ]);
        setModels(modelsData);
        setAppDetails(appDetailsData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id, fetchModels, fetchAppDetails]);

  // Determine Tab Mapping
  const TabsMapping =
    appDetails?.feature_type === FeatureTypes.SDK
      ? SDKTabMapping
      : WebUITabsMapping;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!appDetails) {
    return (
      <div className="text-center text-red-500">
        Failed to load app details.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue={TabsMapping.basicDetails.value}>
        <TabsList
          className={`grid w-[400px] grid-cols-${
            Object.keys(TabsMapping).length
          }`}
        >
          {Object.values(TabsMapping).map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={TabsMapping.basicDetails.value}>
          {appDetails.feature_type === FeatureTypes.WebUI ? (
            <WebUIAppForm app={appDetails} models={models} />
          ) : (
            <SdkAppForm app={appDetails} models={models} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
