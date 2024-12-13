"use client";

import { useState } from "react";
import { App, AppType } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { deleteApp } from "@/lib/apps";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FeatureTypes } from "./constants";

interface AppListingProps {
  initialApps: App[];
}

function filterApps(apps: App[], filterType: AppType | "all"): App[] {
  if (filterType === "all") return apps;
  console.log(apps, filterType)
  return apps.filter((app) => app.type === filterType);
}

export default function AppListing({ initialApps }: AppListingProps) {
  const [apps, setApps] = useState(initialApps);
  //   const [sortBy, setSortBy] = useState<keyof App>("name");
  //   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterType, setFilterType] = useState<AppType | "all">("all");

  //   const handleSort = (column: keyof App) => {
  //     if (column === sortBy) {
  //       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  //     } else {
  //       setSortBy(column);
  //       setSortOrder("asc");
  //     }
  //     setApps(sortApps(apps, column, sortOrder === "asc" ? "desc" : "asc"));
  //   };

  const handleDeleteApp = async (appId: string) => {
    try {
      await deleteApp(appId);
      setApps(apps.filter((a) => a.id !== appId));
      toast.success("App deleted successfully", { position: "top-right" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to delete App", {
        position: "top-right",
      });
    }
  };

  const handleFilter = (type: AppType | "all") => {
    setFilterType(type);
    setApps(filterApps(initialApps, type));
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Select
          value={filterType}
          onValueChange={(value) => handleFilter(value as AppType | "all")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value={FeatureTypes.WebUI}>WebUI</SelectItem>
            <SelectItem value={FeatureTypes.SDK}>SDK</SelectItem>
          </SelectContent>
        </Select>
    
        <Button asChild>
          <Link
            href="/dashboard/apps/create"
            className="flex items-center font-bold"
          >
            {/* <Plus className="mr-3 h-4 w-4" /> */}
            Create App
          </Link>
        </Button>
      </div>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              Name
              {/* <Button variant="ghost" onClick={() => handleSort("name")}>
                Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button> */}
            </TableHead>
            <TableHead>
              Created At{" "}
              {/* <Button variant="ghost" onClick={() => handleSort("created_at")}>
                Created At{" "}
                {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button> */}
            </TableHead>
            <TableHead>
              Type
              {/* <Button variant="ghost" onClick={() => handleSort("type")}>
                Type {sortBy === "type" && (sortOrder === "asc" ? "↑" : "↓")}
              </Button> */}
            </TableHead>
            <TableHead>
              Supported Models{" "}
              {/* <Button
                variant="ghost"
                onClick={() => handleSort("supported_models_count")}
              >
                Supported Models{" "}
                {sortBy === "supported_models_count" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </Button> */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <TableRow key={app.id}>
              <TableCell className="text-sm whitespace-nowrap">
                {app.name}
              </TableCell>
              <TableCell>
                {new Date(app.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{app.type}</TableCell>
              <TableCell>{app.models_count}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteApp(app.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
