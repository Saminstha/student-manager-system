import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Mark {
  _id: string;
  student: string;
  course: string;
  marks: number;
}

interface MarksState {
  marks: Mark[];
  loading: boolean;
  error: string;
}

const initialState: MarksState = {
  marks: [],
  loading: false,
  error: "",
};

const marksSlice = createSlice({
  name: "marks",

  initialState,

  reducers: {
    setMarks: (state, action: PayloadAction<Mark[]>) => {
      state.marks = action.payload;
    },

    addMark: (state, action: PayloadAction<Mark>) => {
      state.marks.push(action.payload);
    },

    deleteMark: (state, action: PayloadAction<string>) => {
      state.marks = state.marks.filter((mark) => mark._id !== action.payload);
    },

    updateMark: (state, action: PayloadAction<Mark>) => {
      const index = state.marks.findIndex(
        (mark) => mark._id === action.payload._id,
      );

      if (index !== -1) {
        state.marks[index] = action.payload;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMarks,
  addMark,
  deleteMark,
  updateMark,
  setLoading,
  setError,
} = marksSlice.actions;

export default marksSlice.reducer;
