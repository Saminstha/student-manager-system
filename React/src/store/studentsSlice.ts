import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface StudentCourse {
  _id: string;
  name: string;
  code: string;
}

export interface Student {
  _id: string;
  name: string;
  age: number;
  email: string;
  phone: number;
  courses: StudentCourse[];
  avatar?: string;
}

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string;
}

const initialState: StudentsState = {
  students: [],
  loading: false,
  error: "",
};

const studentsSlice = createSlice({
  name: "students",

  initialState,

  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },

    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },

    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(
        (student) => student._id !== action.payload,
      );
    },

    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(
        (student) => student._id === action.payload._id,
      );

      if (index !== -1) {
        state.students[index] = action.payload;
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
  setStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  setLoading,
  setError,
} = studentsSlice.actions;

export default studentsSlice.reducer;
