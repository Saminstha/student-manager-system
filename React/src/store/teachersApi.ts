import type { Teacher } from "./teachersSlice";
import { authFetch } from "./authFetch";
import { failOnError, resolveFileUrl } from "../lib/httpClient";

const URL = `${import.meta.env.VITE_API_URL}/teachers`;

// photo is optional — omit it to leave an existing teacher's photo
// unchanged.
export interface TeacherInput {
  name: string;
  age: number;
  email: string;
  phone: number;
  photo?: File;
}

interface TeachersResponse {
  message: string;
  teachers: Teacher[];
}

interface TeacherResponse {
  message: string;
  teacher: Teacher;
}

function withAvatarUrl(teacher: Teacher): Teacher {
  return { ...teacher, avatar: resolveFileUrl(teacher.avatar) };
}

// Always sent as multipart/form-data — see the same comment in
// studentsApi.ts.
function toFormData(teacher: TeacherInput): FormData {
  const formData = new FormData();
  formData.append("name", teacher.name);
  formData.append("age", String(teacher.age));
  formData.append("email", teacher.email);
  formData.append("phone", String(teacher.phone));
  if (teacher.photo) formData.append("photo", teacher.photo);
  return formData;
}

export async function fetchTeachers(): Promise<Teacher[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: TeachersResponse = await response.json();
  return data.teachers.map(withAvatarUrl);
}

export async function createTeacher(teacher: TeacherInput): Promise<Teacher> {
  const response = await authFetch(URL, {
    method: "POST",
    body: toFormData(teacher),
  });
  await failOnError(response);

  const data: TeacherResponse = await response.json();
  return withAvatarUrl(data.teacher);
}

export async function removeTeacher(id: string): Promise<void> {
  const response = await authFetch(`${URL}/${id}`, { method: "DELETE" });
  await failOnError(response);
}

export async function editTeacher(id: string, teacher: TeacherInput): Promise<Teacher> {
  const response = await authFetch(`${URL}/${id}`, {
    method: "PUT",
    body: toFormData(teacher),
  });
  await failOnError(response);

  const data: TeacherResponse = await response.json();
  return withAvatarUrl(data.teacher);
}
