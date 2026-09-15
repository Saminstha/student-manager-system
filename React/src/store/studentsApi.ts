import type { Student } from "./studentsSlice";
import { authFetch } from "./authFetch";
import { failOnError, resolveFileUrl } from "../lib/httpClient";

const URL = `${import.meta.env.VITE_API_URL}/students`;

// Shape sent to the backend when creating/updating a student.
// courses is a list of course _ids, not the populated objects the
// backend sends back on read. photo is optional — omit it to leave an
// existing student's photo unchanged.
export interface StudentInput {
  name: string;
  age: number;
  email: string;
  phone: number;
  courses?: string[];
  photo?: File;
}

interface StudentsResponse {
  message: string;
  students: Student[];
}

interface StudentResponse {
  message: string;
  student: Student;
}

// Backend sends back a relative "/uploads/xyz.png" path — turn it into
// a full URL the <img> tag can actually load.
function withAvatarUrl(student: Student): Student {
  return { ...student, avatar: resolveFileUrl(student.avatar) };
}

// Always sent as multipart/form-data — the photo is optional, but using
// the same request shape either way keeps this simple. Array fields
// (courses) get JSON.stringify'd since a plain multipart field can only
// hold a string; the backend's parseJsonFields middleware reverses this
// before validating.
function toFormData(student: StudentInput): FormData {
  const formData = new FormData();
  formData.append("name", student.name);
  formData.append("age", String(student.age));
  formData.append("email", student.email);
  formData.append("phone", String(student.phone));
  formData.append("courses", JSON.stringify(student.courses ?? []));
  if (student.photo) formData.append("photo", student.photo);
  return formData;
}

export async function fetchStudents(): Promise<Student[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: StudentsResponse = await response.json();
  return data.students.map(withAvatarUrl);
}

export async function createStudent(student: StudentInput): Promise<Student> {
  const response = await authFetch(URL, {
    method: "POST",
    body: toFormData(student),
  });
  await failOnError(response);

  const data: StudentResponse = await response.json();
  return withAvatarUrl(data.student);
}

export async function removeStudent(id: string): Promise<void> {
  const response = await authFetch(`${URL}/${id}`, { method: "DELETE" });
  await failOnError(response);
}

export async function editStudent(id: string, student: StudentInput): Promise<Student> {
  const response = await authFetch(`${URL}/${id}`, {
    method: "PUT",
    body: toFormData(student),
  });
  await failOnError(response);

  const data: StudentResponse = await response.json();
  return withAvatarUrl(data.student);
}
