import api from "./client";

export async function register({ email, password, displayName }) {
  const { data } = await api.post("/auth/register", {
    email,
    password,
    displayName,
  });
  localStorage.setItem("authToken", data.token);
  return data;
}

export async function login({ email, password }) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("authToken", data.token);
  return data;
}

export async function me() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("authToken");
}
