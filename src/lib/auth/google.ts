import axios from "axios";
import { api } from "@/lib/utils";

export async function initiateGoogleLogin() {
  try {
    const { data } = await axios.get(`/api/auth/google/login/`);
    return data.oauth_url;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function handleGoogleCallback(code: string) {
  try {
    const { data } = await axios.post(`/api/auth/google/login/callback/?code=${code}`);
    return data;
  } catch (error) {
    console.error("Google callback error:", error);
    throw error;
  }
}

export async function getUserProfile() {
  const { data } = await api.get(`/api/auth/profile/`);
  return data;
}

export async function refreshToken(refresh_token: string) {
  const { data } = await axios.post(`/api/auth/token/refresh/`, {
    refresh: refresh_token,
  });
  return data;
}
