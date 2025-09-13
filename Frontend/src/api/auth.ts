import api, { setTokens, clearTokens } from "../lib/http";

export async function signup(payload: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile?: string;
  roles: string[];
}) {
  await api.post("/api/auth/signup", payload);
}

export async function signin(email: string, password: string) {
  const { data } = await api.post("/api/auth/signin", { email, password });
  setTokens(data.accessToken, data.refreshToken);
  return data; // includes tokens, {roles/fullName}
}

export async function me() {
  const { data } = await api.get("/api/auth/me");
  return data; // { fullName, email, mobile, roles }
}

export function logoutClientOnly() {
  clearTokens();
}
