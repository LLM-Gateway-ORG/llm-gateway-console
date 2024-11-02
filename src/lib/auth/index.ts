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
    { firstname: firstName, lastname: lastName, username: email, email, password }
  );
  return response.data;
}
