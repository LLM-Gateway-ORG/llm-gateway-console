import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from "js-cookie";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleAuthTokens(tokens: {
  access?: string;
  refresh?: string;
}) {
  if (tokens?.access && tokens?.refresh) {
    Cookies.set("access_token", tokens.access);
    Cookies.set("refresh_token", tokens.refresh);
    return true;
  }
  return false;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  // withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (!token) {
      // Redirect to login
      console.log("Redirecting to login");
      window.location.href = "/auth";
    }
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear tokens
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      // Redirect to login
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);
