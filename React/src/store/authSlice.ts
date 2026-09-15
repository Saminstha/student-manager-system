import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const TOKEN_STORAGE_KEY = "auth-token";

export interface CurrentUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  token: string | null;
  user: CurrentUser | null;
}

const initialState: AuthState = {
  token: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // Called right after login (or a successful silent refresh + profile
    // fetch): we have both the token and the profile.
    setCredentials: (state, action: PayloadAction<{ token: string; user: CurrentUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload.token);
    },

    // Called whenever withTokenRefresh silently swaps in a fresh access
    // token mid-session.
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem(TOKEN_STORAGE_KEY, action.payload);
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    },
  },
});

export const { setCredentials, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
