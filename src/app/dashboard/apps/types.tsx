export type AppType = "webui" | "sdk";

export interface App {
  id: string;
  name: string;
  createdAt: Date;
  type: string;
  models_count: number;
}
