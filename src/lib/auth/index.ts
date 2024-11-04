import axios from "axios";

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
  access_token: string,
  oldPassword: string,
  newPassword: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/reset/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || "Failed to reset password");
  }

  return response.json();
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
