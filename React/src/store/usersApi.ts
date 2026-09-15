import type { AppUser } from "./usersSlice";
import { authFetch } from "./authFetch";
import { failOnError, resolveFileUrl } from "../lib/httpClient";

const URL = `${import.meta.env.VITE_API_URL}/users`;

// Sent to PATCH /users/:id. role is a list of role *names* (e.g.
// ["admin"]) — the backend looks up the matching Role documents itself.
// avatar is optional — omit it to leave the existing photo unchanged.
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string[];
  avatar?: File;
}

interface UsersResponse {
  message: string;
  users: AppUser[];
}

interface UserResponse {
  message: string;
  user: AppUser;
}

function withAvatarUrl(user: AppUser): AppUser {
  return { ...user, avatar: resolveFileUrl(user.avatar) };
}

export async function fetchUsers(): Promise<AppUser[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: UsersResponse = await response.json();
  return data.users.map(withAvatarUrl);
}

export async function editUser(id: string, changes: UpdateUserInput): Promise<AppUser> {
  // Always sent as multipart/form-data — the avatar is optional, but
  // using the same request shape either way keeps this simple. role is
  // JSON.stringify'd since a plain multipart field can only hold a
  // string; the backend's parseJsonFields middleware reverses this
  // before validating.
  const formData = new FormData();
  if (changes.firstName !== undefined) formData.append("firstName", changes.firstName);
  if (changes.lastName !== undefined) formData.append("lastName", changes.lastName);
  if (changes.email !== undefined) formData.append("email", changes.email);
  if (changes.role !== undefined) formData.append("role", JSON.stringify(changes.role));
  if (changes.avatar) formData.append("avatar", changes.avatar);

  const response = await authFetch(`${URL}/${id}`, {
    method: "PATCH",
    body: formData,
  });
  await failOnError(response);

  const data: UserResponse = await response.json();
  return withAvatarUrl(data.user);
}

export async function removeUser(id: string): Promise<void> {
  const response = await authFetch(`${URL}/${id}`, { method: "DELETE" });
  await failOnError(response);
}
