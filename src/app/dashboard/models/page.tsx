"use client";

import { useEffect, useState, useMemo } from "react";
import { getAIModels } from "@/lib/providers";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// You might want to replace this with your actual model type
interface Model {
  name: string;
  provider: string;
  developer: string;
  active: Boolean;
}

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [models, setModels] = useState<Model[]>([]);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const data = await getAIModels();
      setModels(
        data.models.map((model) => ({
          name: model.model_name,
          provider: model.provider,
          developer: model.developer,
          active: model.active,
        }))
      );
      setAvailableProviders(data.available_providers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  // Memoize filtered models for better performance
  // Memoize filtered models for better performance
  const filteredModels = useMemo(() => {
    return models
      .filter((model) => {
        // Check if model name matches search query
        const matchesSearch = model.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        // Check if model matches selected provider
        const matchesProvider =
          providerFilter === "all" || model.provider === providerFilter;

        // Check active status filter
        const matchesActiveFilter = !activeFilter || model.active;

        // Return true if all conditions are met
        return matchesSearch && matchesProvider && matchesActiveFilter;
      })
      .sort((a, b) => {
        // First sort by active status (active ones first)
        if (a.active !== b.active) {
          return a.active ? -1 : 1;
        }
        // Then sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }, [models, searchQuery, providerFilter, activeFilter]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Models</h1>
        {/* <Button variant="outline" onClick={fetchModels} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button> */}
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader className="space-y-1">
          <CardTitle>Available Models</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredModels.length} models found
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="flex flex-row items-center gap-4">
                <Input
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <div className="flex gap-1 items-center">
                  <Switch
                    id="only_active"
                    checked={activeFilter}
                    onCheckedChange={() => {
                      setActiveFilter((prev) => !prev);
                    }}
                  />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {availableProviders.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
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
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
                    <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Provider</TableHead>
                      {/* <TableHead className="font-semibold">Developer</TableHead> */}
                      <TableHead className="font-semibold text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.map((model) => (
                      <TableRow
                        key={model.name}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {model.active ? (
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            )}

                            {model.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                              {model.provider}
                            </span>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <span className="text-gray-600 dark:text-gray-300">
                            {model.developer}
                          </span>
                        </TableCell> */}
                        <TableCell className="text-right">
                          {model.active ? (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                              Inactive
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
