import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentsSlice";
import teachersReducer from "./teachersSlice";
import coursesReducer from "./coursesSlice";
import marksReducer from "./marksSlice";
import authReducer from "./authSlice";
import usersReducer from "./usersSlice";

export const store = configureStore({
  reducer: {
    students: studentsReducer,
    teachers: teachersReducer,
    courses: coursesReducer,
    marks: marksReducer,
    auth: authReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
