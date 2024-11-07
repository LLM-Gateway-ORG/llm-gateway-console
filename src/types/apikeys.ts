export interface ApiKey {
  created_at: string | number | Date;
  id: string;
  name: string;
  key?: string;
}

export interface CreateApiKeyRequest {
  name: string;
}

// export interface CreateApiKeyResponse {
//   id: string;
//   key: ApiKey;
// }
