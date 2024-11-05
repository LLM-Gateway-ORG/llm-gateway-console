import { ProviderKey, ModelsResponse } from "../types/providers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAIModels(
  token: string,
  params?: { name?: string; provider?: string }
): Promise<ModelsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.name) queryParams.append("name", params.name);
  if (params?.provider) queryParams.append("provider", params.provider);

  const response = await fetch(
    `${API_BASE_URL}/api/provider/ai/models/?${queryParams.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch AI models");
  }

  return response.json();
}

export async function getProviders(token: string): Promise<ProviderKey[]> {
  const response = await fetch(`${API_BASE_URL}/api/provider/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch providers");
  }

  return response.json();
}

export async function createProvider(
  token: string,
  data: { provider: string; api_key: string }
): Promise<ProviderKey> {
  const response = await fetch(`${API_BASE_URL}/api/provider/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create provider");
  }

  return response.json();
}

export async function deleteProvider(
  token: string,
  providerId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/provider/${providerId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete provider");
  }
}

export async function updateProvider(
  token: string,
  providerId: string,
  data: Partial<{ provider: string; api_key: string; name: string }>
): Promise<ProviderKey> {
  const response = await fetch(`${API_BASE_URL}/api/provider/${providerId}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update provider");
  }

  return response.json();
}

export async function getProviderDetails(
  token: string,
  providerId: string
): Promise<ProviderKey> {
  const response = await fetch(`${API_BASE_URL}/api/provider/${providerId}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to update provider");
  }

  return response.json();
}
