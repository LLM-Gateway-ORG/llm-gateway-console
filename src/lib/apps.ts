import { api } from "@/lib/utils";
import { Apps, CreateAppRequest } from "@/types/apps";

export async function getApps(): Promise<Apps[]> {
  const response = await api.get(`/api/apps/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to fetch providers");
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

export async function deleteApp(appId: string): Promise<void> {
  const response = await api.delete(`/api/apps/${appId}/`);

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to delete App");
  }
}
