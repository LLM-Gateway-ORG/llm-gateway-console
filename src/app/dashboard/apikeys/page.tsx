"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { Copy, Key, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { createApiKey, getApiKeys, revokeApiKey } from "@/lib/apikeys";
import { ApiKey } from "@/types/apikeys";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CreateKeyForm {
  name: string;
}

// Add this function above the ModelsPage component
function getExampleCurlCommand(baseUrl: string) {
  return `curl --location '${baseUrl}api/provider/generate/completion/' \\
--header 'x-api-key: <API Key>' \\
--data '{
    "provider_id": "<Provider ID>",
    "model_name": "<Model Name>",
    "messages": [
        {
            "role": "user",
            "content": "<Message>"
        }
    ]
}'`;
}

export default function ApiKeysPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateKeyForm>({
    name: "",
  });
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchApiKeys = async () => {
    try {
      const keys = await getApiKeys();
      setApiKeys(keys);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to fetch API keys", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const createNewApiKey = async () => {
    if (!formData.name) {
      toast.error("Please fill in all fields", {
        position: "top-right",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await createApiKey(formData);
      // Update the list of API keys first
      setApiKeys([
        ...apiKeys,
        {
          id: response.id,
          name: response.name,
          created_at: response.created_at,
          key: response.key,
        },
      ]);
      // Then show the new key and reset the form
      setNewApiKey(response.key?.toString() ?? null);
      setFormData({ name: "" });

      // Close the modal after successful creation
      setShowCreateModal(false);
      console.log(newApiKey);

      toast.success("API key created successfully", { position: "top-right" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to create API key", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    try {
      await revokeApiKey(keyId);

      setApiKeys(apiKeys.filter((key) => key.id !== keyId));

      toast.success("API key revoked successfully", { position: "top-right" });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to revoke API key", {
        position: "top-right",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { position: "top-right" });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">API Keys</h1>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader className="flex flex-row justify-between items-center gap-2 space-y-1">
          <div className="flex flex-col gap-2 justify-left items-start">
            <CardTitle>API Key Management</CardTitle>
            <p className="text-sm text-muted-foreground">
              Create and manage your API keys
            </p>
          </div>
          {/* Create new API key section */}
          <div className="mb-6">
            <Button onClick={() => setShowCreateModal(true)}>
              <Key className="mr-2 h-4 w-4" />
              Create New API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* New API Key Alert */}
          {newApiKey && (
            <Alert className="mb-6 bg-green-500/10">
              {/* <AlertCircle className="h-4 w-4" /> */}
              <AlertTitle>New API Key Generated</AlertTitle>
              <AlertDescription className="mt-2 flex items-center justify-left gap-1">
                <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-sm text-muted-foreground">
                  {newApiKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-none"
                  onClick={() => copyToClipboard(newApiKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* API Keys List */}
          <div className="rounded-md border max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-6 w-[150px]" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground"
                      >
                        No API keys found. Create one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiKeys.map((key) => (
                      <TableRow
                        key={key.id}
                        className="group hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            {key.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600 dark:text-gray-300">
                            {new Date(key.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevoke(key.id)}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* API Usage */}
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <CardHeader className="space-y-1">
          <CardTitle>API Usage</CardTitle>
          <p className="text-sm text-muted-foreground">
            Example curl command for API integration
          </p>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code>
              {getExampleCurlCommand(process.env.NEXT_PUBLIC_API_URL || "")}
            </code>
          </pre>
          <div className="mt-4 space-y-3">
            <h4 className="font-semibold">Variable Descriptions:</h4>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                <span className="font-medium">API Key:</span> Your unique
                authentication key. Find it in your{" "}
                <a
                  href="/dashboard/apikeys"
                  className="text-blue-500 hover:underline"
                >
                  API Settings
                </a>
              </li>
              <li>
                <span className="font-medium">Provider ID:</span> The unique
                identifier for your AI provider. View available providers in{" "}
                <a
                  href="/dashboard/providers"
                  className="text-blue-500 hover:underline"
                >
                  Providers
                </a>
              </li>
              <li>
                <span className="font-medium">Model Name:</span> The specific
                model you want to use. See the table above for available models
              </li>
              <li>
                <span className="font-medium">Message:</span> Your input prompt
                or message to the AI model
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="keyName" className="text-sm font-medium">
                Key Name
              </label>
              <Input
                id="keyName"
                placeholder="Enter key name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                maxLength={100}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={createNewApiKey} disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Key className="mr-2 h-4 w-4" />
              )}
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
