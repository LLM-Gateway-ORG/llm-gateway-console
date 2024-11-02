import axios from "axios";

export async function initiateGoogleLogin() {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/login/`
    );
    return data.oauth_url;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}

export async function handleGoogleCallback(code: string) {
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/login/callback/?code=${code}`
    );
    return data;
  } catch (error) {
    console.error("Google callback error:", error);
    throw error;
  }
}

export async function getUserProfile(access_token: string) {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return data;
}

export async function refreshToken(refresh_token: string) {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh/`,
    { refresh: refresh_token }
  );
  return data;
}
