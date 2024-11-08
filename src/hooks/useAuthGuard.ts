import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getUserProfile, refreshToken } from "@/lib/auth/google";

export interface User {
  id: number;
  name: string;
  email: string;
  firstname: string;
  lastname: string;
}

export function useAuthGuard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      let token = Cookies.get("access_token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const isTokenExpired = (token: string) => {
        try {
          const base64Url = token.split('.')[1];
          console.log("base64Url", base64Url);
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const { exp } = JSON.parse(jsonPayload);
          const expiryDate = new Date(exp * 1000);
          return expiryDate < new Date();
        } catch (error) {
          console.error("Failed to parse token:", error);
          return true; // Assume expired if parsing fails
        }
      };

      try {
        if (isTokenExpired(token)) {
          const refresh_token = Cookies.get("refresh_token");
          if (!refresh_token) {
            router.push("/auth");
            return;
          }
          const newTokenData = await refreshToken(refresh_token);
          if (newTokenData?.access) {
            Cookies.set("access_token", newTokenData.access);
            token = newTokenData.access;
          } else {
            router.push("/auth");
            return;
          }
        }

        const response = await getUserProfile();
        setUser(response);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/auth");
      }
    };

    fetchUser();
  }, [router]);

  return user;
}
