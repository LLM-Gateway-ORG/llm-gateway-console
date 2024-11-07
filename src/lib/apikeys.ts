import { api } from "@/lib/utils";
import { CreateApiKeyRequest, ApiKey } from "@/types/apikeys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createApiKey(
  token: string,
  data: CreateApiKeyRequest
): Promise<ApiKey> {
  const response = await api.post(`${API_BASE_URL}/api/auth/apikey/`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create API key");
  }

  return response.data;
}

export async function getApiKeys(token: string): Promise<ApiKey[]> {
  const response = await api.get(`${API_BASE_URL}/api/auth/apikey/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch API keys");
  }

  return response.data;
}

export async function revokeApiKey(
  token: string,
  keyId: string
): Promise<void> {
  const response = await api.delete(
    `${API_BASE_URL}/api/auth/apikey/${keyId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to revoke API key");
  }
}
