import { api } from "@/lib/utils";
import { ProviderKey, ModelsResponse } from "../types/providers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAIModels(
  token: string,
  params?: { name?: string; provider?: string }
): Promise<ModelsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.name) queryParams.append("name", params.name);
  if (params?.provider) queryParams.append("provider", params.provider);

  const response = await api.get(
    `${API_BASE_URL}/api/provider/ai/models/?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch AI models");
  }

  return response.data;
}

export async function getProviders(token: string): Promise<ProviderKey[]> {
  const response = await api.get(`${API_BASE_URL}/api/provider/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch providers");
  }

  return response.data;
}

export async function createProvider(
  token: string,
  data: { provider: string; api_key: string }
): Promise<ProviderKey> {
  const response = await api.post(`${API_BASE_URL}/api/provider/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create provider");
  }

  return response.data;
}

export async function deleteProvider(
  token: string,
  providerId: string
): Promise<void> {
  const response = await api.delete(
    `${API_BASE_URL}/api/provider/${providerId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to delete provider");
  }
}

export async function updateProvider(
  token: string,
  providerId: string,
  data: Partial<{ provider: string; api_key: string; name: string }>
): Promise<ProviderKey> {
  const response = await api.put(
    `${API_BASE_URL}/api/provider/${providerId}/`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to update provider");
  }

  return response.data;
}

export async function getProviderDetails(
  token: string,
  providerId: string
): Promise<ProviderKey> {
  const response = await api.get(
    `${API_BASE_URL}/api/provider/${providerId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to update provider");
  }

  return response.data;
}
