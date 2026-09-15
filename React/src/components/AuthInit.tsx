import { useEffect, useState, type ReactNode } from "react";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { getCurrentUser, refreshAccessToken } from "../store/authApi";

interface AuthInitProps {
  children: ReactNode;
}

// Runs once on app startup. Tries to silently restore the session by
// calling POST /auth/refresh — the refresh token lives in an httpOnly
// cookie, so no JS access to it is needed. If the cookie is still valid
// we get a fresh access token back, fetch the current user, and hydrate
// the store; the user never sees the login page on a page reload.
//
// If the cookie is missing or expired, the request just fails quietly
// and the user stays logged out — ProtectedRoute sends them to /login.
//
// Nothing renders until this check finishes, so there's no flash of the
// login page on every refresh while the cookie is still being checked.
function AuthInit({ children }: AuthInitProps) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession(): Promise<void> {
      try {
        const token = await refreshAccessToken();
        const user = await getCurrentUser(token);
        dispatch(setCredentials({ token, user }));
      } catch {
        // No valid refresh-token cookie — that's fine, stay logged out.
      } finally {
        setIsReady(true);
      }
    }

    restoreSession();
  }, [dispatch]);

  if (!isReady) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthInit;
