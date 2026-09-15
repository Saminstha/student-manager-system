import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setUsers,
  updateUser as updateUserAction,
  deleteUser as deleteUserAction,
  setLoading,
  setError,
} from "../store/usersSlice";
import { fetchUsers, editUser, removeUser, type UpdateUserInput } from "../store/usersApi";

function useUsers() {
  const dispatch = useAppDispatch();

  const users = useAppSelector((state) => state.users.users);
  const loading = useAppSelector((state) => state.users.loading);
  const error = useAppSelector((state) => state.users.error);

  const loadUsers = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const data = await fetchUsers();
      dispatch(setUsers(data));
      dispatch(setError(""));
    } catch (err) {
      if (err instanceof Error) {
        dispatch(setError(err.message));
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function updateUser(id: string, changes: UpdateUserInput): Promise<void> {
    const updatedUser = await editUser(id, changes);
    dispatch(updateUserAction(updatedUser));
  }

  async function deleteUser(id: string): Promise<void> {
    await removeUser(id);
    dispatch(deleteUserAction(id));
  }

  return {
    users,
    loading,
    error,
    updateUser,
    deleteUser,
    refetch: loadUsers,
  };
}

export default useUsers;
