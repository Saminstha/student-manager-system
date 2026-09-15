// Shared helpers for every store/*Api.ts file — attaching the access
// token, resolving uploaded-file URLs, and turning a failed response
// into a readable error.

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Carries a field->message map when the backend responds with Zod
// validation errors, so a form can show each message next to the input
// that caused it.
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

interface ZodIssueLike {
  path: (string | number)[];
  message: string;
}

// fetch only rejects on a network failure — a 400 or 401 arrives here as
// a perfectly normal response and has to be checked by hand. Matches our
// backend's two error shapes: { error: "..." } and { errors: [...] }
// (the latter straight from Zod on a validation failure).
export async function failOnError(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const body = await response.json().catch(() => null);

  if (body?.error) {
    throw new ApiError(response.status, body.error);
  }

  if (Array.isArray(body?.errors)) {
    const issues = body.errors as ZodIssueLike[];
    const fields = Object.fromEntries(issues.map((issue) => [issue.path.join("."), issue.message]));
    const message = issues.map((issue) => issue.message).join(", ");

    throw new ApiError(response.status, message || "Validation failed", fields);
  }

  throw new ApiError(response.status, `Request failed with status ${response.status}`);
}

// Turns a "/uploads/xyz.png" path from the backend into a full URL the
// <img> tag can load.
export function resolveFileUrl(path?: string): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

// Attach to a fetch call's headers to send the JWT:
// { ...authHeader(token) }
export function authHeader(token: string | null): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Runs `call` with the current token; if it fails with a 401 (access
// token expired), gets a fresh one via `refresh`, saves it with
// `onRefreshed`, and retries `call` exactly once with the new token.
export async function withTokenRefresh<T>(
  call: (token: string | null) => Promise<T>,
  token: string | null,
  refresh: () => Promise<string>,
  onRefreshed: (newToken: string) => void,
): Promise<T> {
  try {
    return await call(token);
  } catch (err) {
    if (!(err instanceof ApiError) || err.status !== 401) {
      throw err;
    }

    const newToken = await refresh();
    onRefreshed(newToken);

    return call(newToken);
  }
}

export { API_BASE_URL };
