import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setStudents,
  addStudent as addStudentAction,
  updateStudent as updateStudentAction,
  deleteStudent as deleteStudentAction,
  setLoading,
  setError,
} from "../store/studentsSlice";
import {
  fetchStudents,
  createStudent,
  editStudent,
  removeStudent,
  type StudentInput,
} from "../store/studentsApi";

// Loads students on mount and exposes CRUD actions that call the backend
// and keep the Redux store in sync.
function useStudents() {
  const dispatch = useAppDispatch();

  const students = useAppSelector((state) => state.students.students);
  const loading = useAppSelector((state) => state.students.loading);
  const error = useAppSelector((state) => state.students.error);

  const loadStudents = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const data = await fetchStudents();
      dispatch(setStudents(data));
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
    loadStudents();
  }, [loadStudents]);

  async function addStudent(student: StudentInput): Promise<void> {
    const newStudent = await createStudent(student);
    dispatch(addStudentAction(newStudent));
  }

  async function updateStudent(
    id: string,
    student: StudentInput,
  ): Promise<void> {
    const updatedStudent = await editStudent(id, student);
    dispatch(updateStudentAction(updatedStudent));
  }

  async function deleteStudent(id: string): Promise<void> {
    await removeStudent(id);
    dispatch(deleteStudentAction(id));
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    refetch: loadStudents,
  };
}

export default useStudents;
