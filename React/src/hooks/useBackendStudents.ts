import { useEffect } from "react";
import {
  setBackendStudents,
  setError,
  setLoading,
} from "../store/studentsSlice";
import { useAppDispatch } from "../store/hooks";

const URL = `${import.meta.env.VITE_API_URL}/students`;

interface BackendStudent {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: number;
}

interface BackendResponse {
  message: string;
  students: BackendStudent[];
}

function useBackendStudents() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchBackendStudents = async () => {
      dispatch(setLoading(true));

      try {
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error("Failed to fetch students from backend");
        }

        const data: BackendResponse = await response.json();

        console.log("Backend response:", data);

        dispatch(setBackendStudents(data.students));
      } catch (error) {
        if (error instanceof Error) {
          dispatch(setError(error.message));
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBackendStudents();
  }, [dispatch]);
}

export default useBackendStudents;
