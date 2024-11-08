import { api } from "@/lib/utils";
import { ProviderKey, ModelsResponse } from "../types/providers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAIModels(params?: {
  name?: string;
  provider?: string;
}): Promise<ModelsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.name) queryParams.append("name", params.name);
  if (params?.provider) queryParams.append("provider", params.provider);

  const response = await api.get(
    `/api/provider/ai/models/?${queryParams.toString()}`
  );

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch AI models");
  }

  return response.data;
}

export async function getProviders(): Promise<ProviderKey[]> {
  const response = await api.get(`/api/provider/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch providers");
  }

  return response.data;
}

export async function createProvider(data: {
  provider: string;
  api_key: string;
}): Promise<ProviderKey> {
  const response = await api.post(`/api/provider/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create provider");
  }

  return response.data;
}

export async function deleteProvider(providerId: string): Promise<void> {
  const response = await api.delete(`/api/provider/${providerId}/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to delete provider");
  }
}

export async function updateProvider(
  providerId: string,
  data: Partial<{ provider: string; api_key: string; name: string }>
): Promise<ProviderKey> {
  const response = await api.put(`/api/provider/${providerId}/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to update provider");
  }

  return response.data;
}

export async function getProviderDetails(
  providerId: string
): Promise<ProviderKey> {
  const response = await api.get(`/api/provider/${providerId}/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to update provider");
  }

  return response.data;
}
