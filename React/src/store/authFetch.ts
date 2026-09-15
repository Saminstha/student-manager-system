import { store } from "./store";
import { setToken } from "./authSlice";
import { refreshAccessToken } from "./authApi";
import { ApiError, authHeader, withTokenRefresh } from "../lib/httpClient";

// Every students/teachers/courses/marks API call goes through this
// instead of the raw fetch() — it attaches the current access token,
// and if the token turns out to have expired mid-session (a 401 comes
// back), it silently refreshes and retries the request exactly once.
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  function call(token: string | null): Promise<Response> {
    return fetch(url, {
      ...options,
      headers: { ...options.headers, ...authHeader(token) },
    });
  }

  return withTokenRefresh(
    async (token) => {
      const response = await call(token);
      // A 401 here means the access token expired — throw so
      // withTokenRefresh's catch block can refresh and retry. Anything
      // else (including other error statuses) is returned as-is; each
      // api file's own failOnError() decides what counts as a failure.
      if (response.status === 401) {
        const body = await response.clone().json().catch(() => null);
        throw new ApiError(401, body?.error ?? "Unauthorized");
      }
      return response;
    },
    store.getState().auth.token,
    refreshAccessToken,
    (newToken) => store.dispatch(setToken(newToken)),
  );
}
