export interface Apps {
  id: string;
  name: string;
  created_at: string;
  feature_type: string;
  supported_models: string[];
}

export interface AppDetails {
  id: string;
  name: string;
  created_at: string;
  feature_type: string;
  supported_models: string[];
  instruction: string;
  config: any;
}

export interface CreateAppRequest {
  name: string;
  supported_models: string[];
  config: any;
}
