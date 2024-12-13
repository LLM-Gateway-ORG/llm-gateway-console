export interface Apps {
  id: string;
  name: string;
  created_at: string;
  feature_type: string;
  supported_models: string[];
}

export interface CreateAppRequest {
    name: string;
    supported_models: string[],
    config: any
}