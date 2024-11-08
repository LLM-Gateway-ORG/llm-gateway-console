import axios from "axios";
import { api } from "@/lib/utils";

export async function signIn(email: string, password: string) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
    { username: email, password }
  );
  return response.data;
}

export async function signUp({
  firstName,
  lastName,
  email,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register/`,
    {
      firstname: firstName,
      lastname: lastName,
      username: email,
      email,
      password,
    }
  );
  return response.data;
}

export const resetPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  const response = await api.post(`/api/auth/password/reset/`, {
    data: {
      old_password: oldPassword,
      new_password: newPassword,
    },
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error("Failed to reset password");
  }

  return response.data;
};

// Password validation utilities
export const validatePassword = (password: string) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return errors;
};
