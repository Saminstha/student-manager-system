import { authFetch } from "./authFetch";
import { failOnError } from "../lib/httpClient";
import type { UserRole } from "./usersSlice";

const URL = `${import.meta.env.VITE_API_URL}/roles`;

interface RolesResponse {
  message: string;
  roles: UserRole[];
}

export async function fetchRoles(): Promise<UserRole[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: RolesResponse = await response.json();
  return data.roles;
}
