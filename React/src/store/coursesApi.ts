import type { Course } from "./coursesSlice";
import { authFetch } from "./authFetch";
import { failOnError } from "../lib/httpClient";

const URL = `${import.meta.env.VITE_API_URL}/courses`;

export interface CourseInput {
  name: string;
  code: string;
  teacher: string;
  students?: string[];
}

interface CoursesResponse {
  message: string;
  courses: Course[];
}

interface CourseResponse {
  message: string;
  course: Course;
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: CoursesResponse = await response.json();
  return data.courses;
}

export async function createCourse(course: CourseInput): Promise<Course> {
  const response = await authFetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  await failOnError(response);

  const data: CourseResponse = await response.json();
  return data.course;
}

export async function removeCourse(id: string): Promise<void> {
  const response = await authFetch(`${URL}/${id}`, { method: "DELETE" });
  await failOnError(response);
}

export async function editCourse(id: string, course: CourseInput): Promise<Course> {
  const response = await authFetch(`${URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  await failOnError(response);

  const data: CourseResponse = await response.json();
  return data.course;
}
