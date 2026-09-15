import { authHeader, failOnError, resolveFileUrl } from "../lib/httpClient";
import type { CurrentUser } from "./authSlice";

const AUTH_URL = `${import.meta.env.VITE_API_URL}/auth`;

export interface SignupInput {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  avatar?: File;
}

export interface LoginInput {
  username: string;
  password: string;
}

interface RawUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
}

function toCurrentUser(raw: RawUser): CurrentUser {
  return { ...raw, avatar: resolveFileUrl(raw.avatar) };
}

export async function signup(input: SignupInput): Promise<CurrentUser> {
  const formData = new FormData();
  formData.append("firstName", input.firstName);
  formData.append("lastName", input.lastName);
  formData.append("username", input.username);
  formData.append("email", input.email);
  formData.append("password", input.password);
  if (input.avatar) formData.append("avatar", input.avatar);

  const response = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    body: formData,
  });

  await failOnError(response);

  return toCurrentUser(await response.json());
}

export async function login(input: LoginInput): Promise<string> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    // Lets the browser store the httpOnly refresh-token cookie the
    // backend sets on a successful login.
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  await failOnError(response);

  const data: { token: string } = await response.json();
  return data.token;
}

// Silently exchanges the httpOnly refresh-token cookie for a fresh
// access token. Called on app load (so a page refresh doesn't force a
// re-login) and by withTokenRefresh when a request gets a 401.
export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${AUTH_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  await failOnError(response);

  const data: { token: string } = await response.json();
  return data.token;
}

export async function logout(token: string | null): Promise<void> {
  const response = await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: authHeader(token),
  });

  await failOnError(response);
}

export async function getCurrentUser(token: string): Promise<CurrentUser> {
  const response = await fetch(`${AUTH_URL}/me`, {
    headers: authHeader(token),
  });

  await failOnError(response);

  return toCurrentUser(await response.json());
}
