import { api } from "@/lib/utils";
import { AppDetails, Apps, CreateAppRequest } from "@/types/apps";
import { UUID } from "crypto";

export async function getApps(): Promise<Apps[]> {
  const response = await api.get(`/api/apps/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch apps");
  }

  return response.data;
}

export async function getAppDetails(id: string): Promise<AppDetails> {
  const response = await api.get(`/api/apps/${id}/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch app");
  }

  return response.data;
}

export async function createApp(data: CreateAppRequest): Promise<Apps> {
  const response = await api.post(`/api/apps/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create App");
  }

  return response.data;
}

export async function updateApp(id: string, data: any): Promise<Apps> {
  const response = await api.put(`/api/apps/${id}/`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to create App");
  }

  return response.data;
}

export async function deleteApp(appId: string): Promise<void> {
  const response = await api.delete(`/api/apps/${appId}/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to delete App");
  }
}
