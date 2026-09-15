import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Teacher {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: number;
  avatar?: string;
}

interface TeachersState {
  teachers: Teacher[];
  loading: boolean;
  error: string;
}

const initialState: TeachersState = {
  teachers: [],
  loading: false,
  error: "",
};

const teachersSlice = createSlice({
  name: "teachers",

  initialState,

  reducers: {
    setTeachers: (state, action: PayloadAction<Teacher[]>) => {
      state.teachers = action.payload;
    },

    addTeacher: (state, action: PayloadAction<Teacher>) => {
      state.teachers.push(action.payload);
    },

    deleteTeacher: (state, action: PayloadAction<string>) => {
      state.teachers = state.teachers.filter(
        (teacher) => teacher._id !== action.payload,
      );
    },

    updateTeacher: (state, action: PayloadAction<Teacher>) => {
      const index = state.teachers.findIndex(
        (teacher) => teacher._id === action.payload._id,
      );

      if (index !== -1) {
        state.teachers[index] = action.payload;
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
  setTeachers,
  addTeacher,
  deleteTeacher,
  updateTeacher,
  setLoading,
  setError,
} = teachersSlice.actions;

export default teachersSlice.reducer;
