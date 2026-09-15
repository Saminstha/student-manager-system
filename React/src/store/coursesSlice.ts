import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CoursePerson {
  _id: string;
  name: string;
  email: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  teacher: CoursePerson | null;
  students: CoursePerson[];
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: "",
};

const coursesSlice = createSlice({
  name: "courses",

  initialState,

  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },

    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },

    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload,
      );
    },

    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(
        (course) => course._id === action.payload._id,
      );

      if (index !== -1) {
        state.courses[index] = action.payload;
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
  setCourses,
  addCourse,
  deleteCourse,
  updateCourse,
  setLoading,
  setError,
} = coursesSlice.actions;

export default coursesSlice.reducer;
