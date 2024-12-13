"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/components/ui/multiple-selector";
import { useRouter } from "next/navigation";
import { getAIModels } from "@/lib/providers";
import SdkFormBuilder from "./sdk-builder";
import WebUIFormBuilder from "./webui-buider";

export default function CreateApps() {
  const router = useRouter();
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [models, setModels] = useState<Option[]>([]);
  const [featureType, setFeatureTyoe] = useState("sdk");

  const fetchModels = async () => {
    try {
      const data = await getAIModels();
      setModels(
        data.models
          .filter((model) => model.active)
          .map((model) => ({
            value: model.model_name,
            label: model.model_name,
          }))
      );
    } catch (error) {
      console.error("Failed to fetch models:", error);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create App</h1>
      </div>
      <div className="flex flex-col gap-2">
        <h2>Type</h2>
        <Select
          onValueChange={(value) => {
            setFeatureTyoe(value);
          }}
          defaultValue={featureType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a feature type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sdk">SDK</SelectItem>
            <SelectItem value="webui">WebUI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {featureType == "sdk" ? (
        <SdkFormBuilder models={models} />
      ) : (
        <WebUIFormBuilder models={models} />
      )}
    </div>
  );
}
