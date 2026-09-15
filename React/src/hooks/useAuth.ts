import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout as logoutAction, setCredentials } from "../store/authSlice";
import * as authApi from "../store/authApi";
import type { LoginInput, SignupInput } from "../store/authApi";

function useAuth() {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  async function signup(input: SignupInput) {
    return authApi.signup(input);
  }

  async function login(input: LoginInput): Promise<void> {
    const newToken = await authApi.login(input);
    const currentUser = await authApi.getCurrentUser(newToken);
    dispatch(setCredentials({ token: newToken, user: currentUser }));
  }

  async function logout(): Promise<void> {
    try {
      await authApi.logout(token);
    } finally {
      // Always clear local state, even if the network call failed (e.g.
      // the access token had already expired) — the user still wants to
      // be logged out on this device.
      dispatch(logoutAction());
    }
  }

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    signup,
    login,
    logout,
  };
}

export default useAuth;
