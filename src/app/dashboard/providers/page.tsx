"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import {
  getProviders,
  createProvider,
  deleteProvider,
  getProviderDetails,
  updateProvider,
} from "@/lib/providers";
import { Icons } from "@/components/icons";
import Cookies from "js-cookie";
import { getAIModels } from "@/lib/providers";

interface ProviderKey {
  id: string;
  provider: string;
  createdAt: Date;
  isVisible: boolean;
  api_key: string;
}

export default function ProvidersPage() {
  const [keys, setKeys] = useState<ProviderKey[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [providersList, setProvidersList] = useState<string[]>([]);
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentKey, setCurrentKey] = useState<ProviderKey | null>(null);

  const fetchAiModels = async () => {
    const token = Cookies.get("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    const data = await getAIModels(token);
    setProvidersList(data.available_providers);
  };

  // Wrap fetchProviders in useCallback
  const fetchProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const fetchedProviders = await getProviders(token);
      setKeys(
        fetchedProviders.map((provider) => ({
          id: provider.id,
          provider: provider.provider,
          createdAt: new Date(provider.created_at),
          isVisible: false,
          api_key: provider.api_key,
        }))
      );
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to fetch providers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Add dependencies used inside the callback

  useEffect(() => {
    fetchAiModels();
    fetchProviders();
  }, [fetchProviders]); // Now this is safe to use as a dependency

  const handleCreateKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const newProvider = await createProvider(token, {
        provider: formData.get("provider") as string,
        api_key: formData.get("api-key") as string,
      });

      setKeys([
        ...keys,
        { ...newProvider, createdAt: new Date(), isVisible: false },
      ]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Provider created successfully",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to create provider",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      setIsLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      await deleteProvider(token, keyId);
      setKeys(keys.filter((k) => k.id !== keyId));
      toast({
        title: "Success",
        description: "Provider deleted successfully",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to delete provider",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = async (keyId: string) => {
    const providerKey = keys.find((key) => key.id === keyId);
    if (!providerKey) {
      return;
    }

    let updatedApiKey = providerKey.api_key;
    if (!providerKey.isVisible) {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }
      const details = await getProviderDetails(token, keyId);
      const fullApiKey = details.api_key;
      updatedApiKey = `${fullApiKey.slice(0, 2)}${'*'.repeat(fullApiKey.length - 6)}${fullApiKey.slice(-4)}`;
    }

    setKeys(
      keys.map((key) =>
        key.id === keyId
          ? { ...key, isVisible: !key.isVisible, api_key: updatedApiKey }
          : key
      )
    );
  };

  const handleEditKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const updatedApiKey = formData.get("api-key") as string;
      // Assuming you have an updateProvider function
      await updateProvider(token, currentKey!.id, { api_key: updatedApiKey });

      setKeys(
        keys.map((key) =>
          key.id === currentKey!.id ? { ...key, api_key: updatedApiKey } : key
        )
      );
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "API Key updated successfully",
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message || "Failed to update API Key",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Providers</h1>
          <p className="text-gray-600 mt-1">
            Manage your API keys for different providers
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="h-5 w-5" />
              <span>Add API Key</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Add New API Key</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Enter your API key details below. Make sure to keep your API keys secure.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleCreateKey}
              className="space-y-4"
              autoComplete="off"
            >
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-sm font-medium">Provider</Label>
                <Select name="provider" required>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providersList.map((provider) => (
                      <SelectItem key={provider} value={provider}>
                        {provider}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
                <Input
                  id="api-key"
                  name="api-key"
                  type="password"
                  placeholder="Enter your API key"
                  required
                  autoComplete="new-password"
                  className="border-gray-300"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
                Save API Key
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">API Keys</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            A list of all your API keys across different providers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">ID</TableHead>
                <TableHead className="text-left">Provider Name</TableHead>
                <TableHead className="text-left">API Key</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="text-sm">{key.id}</TableCell>
                  <TableCell className="text-sm">{key.provider.toUpperCase()}</TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-center gap-2">
                      {key.isVisible ? (
                        <code className="relative rounded bg-gray-100 px-2 py-1 font-mono text-sm">
                          {key.api_key}
                        </code>
                      ) : (
                        <span className="font-mono text-gray-400">••••••••••••••••</span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {key.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentKey(key);
                          setIsEditDialogOpen(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteKey(key.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-800"
                      >
                        {isLoading ? (
                          <Icons.spinner className="h-4 w-4 animate-spin" />
                        ) : (
                          "Remove"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit API Key</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update the API key for {currentKey?.provider}.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleEditKey}
            className="space-y-4"
            autoComplete="off"
          >
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-sm font-medium">API Key</Label>
              <Input
                id="api-key"
                name="api-key"
                type="password"
                defaultValue={currentKey?.api_key}
                placeholder="Enter new API key"
                required
                autoComplete="new-password"
                className="border-gray-300"
              />
            </div>

            <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-700">
              Update API Key
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
