import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setCourses,
  addCourse as addCourseAction,
  updateCourse as updateCourseAction,
  deleteCourse as deleteCourseAction,
  setLoading,
  setError,
} from "../store/coursesSlice";
import {
  fetchCourses,
  createCourse,
  editCourse,
  removeCourse,
  type CourseInput,
} from "../store/coursesApi";

function useCourses() {
  const dispatch = useAppDispatch();

  const courses = useAppSelector((state) => state.courses.courses);
  const loading = useAppSelector((state) => state.courses.loading);
  const error = useAppSelector((state) => state.courses.error);

  const loadCourses = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const data = await fetchCourses();
      dispatch(setCourses(data));
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
    loadCourses();
  }, [loadCourses]);

  async function addCourse(course: CourseInput): Promise<void> {
    const newCourse = await createCourse(course);
    dispatch(addCourseAction(newCourse));
  }

  async function updateCourse(id: string, course: CourseInput): Promise<void> {
    const updatedCourse = await editCourse(id, course);
    dispatch(updateCourseAction(updatedCourse));
  }

  async function deleteCourse(id: string): Promise<void> {
    await removeCourse(id);
    dispatch(deleteCourseAction(id));
  }

  return {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    refetch: loadCourses,
  };
}

export default useCourses;
