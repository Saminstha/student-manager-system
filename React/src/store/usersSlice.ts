import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserRole {
  _id: string;
  name: string;
  permissions: string[];
}

export interface AppUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole[];
}

interface UsersState {
  users: AppUser[];
  loading: boolean;
  error: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: "",
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    setUsers: (state, action: PayloadAction<AppUser[]>) => {
      state.users = action.payload;
    },

    updateUser: (state, action: PayloadAction<AppUser>) => {
      const index = state.users.findIndex((user) => user._id === action.payload._id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setUsers, updateUser, deleteUser, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;
