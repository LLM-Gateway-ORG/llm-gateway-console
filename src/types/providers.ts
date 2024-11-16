export interface ProviderKey {
  id: string;
  provider: string;
  api_key: string;
  created_at: string;
}

export interface AIModel {
  model_name: string;
  provider: string;
  developer: string;
  active: Boolean;
}

export interface ModelsResponse {
  count: number;
  models: AIModel[];
  available_providers: string[];
}
