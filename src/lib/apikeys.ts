import { api } from "@/lib/utils";
import { CreateApiKeyRequest, ApiKey } from "@/types/apikeys";

export async function createApiKey(data: CreateApiKeyRequest): Promise<ApiKey> {
  const response = await api.post(`/api/auth/apikey/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create API key");
  }

  return response.data;
}

export async function getApiKeys(): Promise<ApiKey[]> {
  const response = await api.get(`/api/auth/apikey/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch API keys");
  }

  return response.data;
}

export async function revokeApiKey(keyId: string): Promise<void> {
  const response = await api.delete(`/api/auth/apikey/${keyId}/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to revoke API key");
  }
}
