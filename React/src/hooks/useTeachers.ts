import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setTeachers,
  addTeacher as addTeacherAction,
  updateTeacher as updateTeacherAction,
  deleteTeacher as deleteTeacherAction,
  setLoading,
  setError,
} from "../store/teachersSlice";
import {
  fetchTeachers,
  createTeacher,
  editTeacher,
  removeTeacher,
  type TeacherInput,
} from "../store/teachersApi";

function useTeachers() {
  const dispatch = useAppDispatch();

  const teachers = useAppSelector((state) => state.teachers.teachers);
  const loading = useAppSelector((state) => state.teachers.loading);
  const error = useAppSelector((state) => state.teachers.error);

  const loadTeachers = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const data = await fetchTeachers();
      dispatch(setTeachers(data));
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
    loadTeachers();
  }, [loadTeachers]);

  async function addTeacher(teacher: TeacherInput): Promise<void> {
    const newTeacher = await createTeacher(teacher);
    dispatch(addTeacherAction(newTeacher));
  }

  async function updateTeacher(
    id: string,
    teacher: TeacherInput,
  ): Promise<void> {
    const updatedTeacher = await editTeacher(id, teacher);
    dispatch(updateTeacherAction(updatedTeacher));
  }

  async function deleteTeacher(id: string): Promise<void> {
    await removeTeacher(id);
    dispatch(deleteTeacherAction(id));
  }

  return {
    teachers,
    loading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    refetch: loadTeachers,
  };
}

export default useTeachers;
