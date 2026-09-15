import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setMarks,
  addMark as addMarkAction,
  updateMark as updateMarkAction,
  deleteMark as deleteMarkAction,
  setLoading,
  setError,
} from "../store/marksSlice";
import {
  fetchMarks,
  createMark,
  editMark,
  removeMark,
  type MarkInput,
} from "../store/marksApi";

function useMarks() {
  const dispatch = useAppDispatch();

  const marks = useAppSelector((state) => state.marks.marks);
  const loading = useAppSelector((state) => state.marks.loading);
  const error = useAppSelector((state) => state.marks.error);

  const loadMarks = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      const data = await fetchMarks();
      dispatch(setMarks(data));
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
    loadMarks();
  }, [loadMarks]);

  async function addMark(mark: MarkInput): Promise<void> {
    const newMark = await createMark(mark);
    dispatch(addMarkAction(newMark));
  }

  async function updateMark(id: string, marks: number): Promise<void> {
    const updatedMark = await editMark(id, marks);
    dispatch(updateMarkAction(updatedMark));
  }

  async function deleteMark(id: string): Promise<void> {
    await removeMark(id);
    dispatch(deleteMarkAction(id));
  }

  return {
    marks,
    loading,
    error,
    addMark,
    updateMark,
    deleteMark,
    refetch: loadMarks,
  };
}

export default useMarks;
