"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectOption } from "../types";
import { getAIModels } from "@/lib/providers";
import SdkAppForm from "../sdk/form-builder";
import WebUIAppForm from "../webui/form-builder";
import { FeatureTypes } from "../constants";

export default function CreateApps() {
  const [models, setModels] = useState<MultiSelectOption[]>([]);
  const [featureType, setFeatureType] = useState(FeatureTypes.SDK);

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
            setFeatureType(value);
          }}
          defaultValue={featureType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a feature type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={FeatureTypes.SDK}>SDK</SelectItem>
            <SelectItem value={FeatureTypes.WebUI}>WebUI</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {featureType == FeatureTypes.SDK ? (
        <SdkAppForm models={models} />
      ) : (
        <WebUIAppForm models={models} />
      )}  
    </div>
  );
}
