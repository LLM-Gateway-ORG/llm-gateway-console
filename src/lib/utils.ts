import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleAuthTokens(tokens: { access?: string; refresh?: string }) {
  if (tokens?.access && tokens?.refresh) {
    Cookies.set("access_token", tokens.access)
    Cookies.set("refresh_token", tokens.refresh)
    return true
  }
  return false
}
