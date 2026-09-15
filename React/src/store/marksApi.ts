import type { Mark } from "./marksSlice";
import { authFetch } from "./authFetch";
import { failOnError } from "../lib/httpClient";

const URL = `${import.meta.env.VITE_API_URL}/marks`;

export interface MarkInput {
  student: string;
  course: string;
  marks: number;
}

interface MarksResponse {
  message: string;
  marks: Mark[];
}

interface MarkResponse {
  message: string;
  mark: Mark;
}

export async function fetchMarks(): Promise<Mark[]> {
  const response = await authFetch(URL);
  await failOnError(response);

  const data: MarksResponse = await response.json();
  return data.marks;
}

export async function createMark(mark: MarkInput): Promise<Mark> {
  const response = await authFetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mark),
  });
  await failOnError(response);

  const data: MarkResponse = await response.json();
  return data.mark;
}

export async function removeMark(id: string): Promise<void> {
  const response = await authFetch(`${URL}/${id}`, { method: "DELETE" });
  await failOnError(response);
}

// The backend only supports PATCH for marks (partial update).
export async function editMark(id: string, marks: number): Promise<Mark> {
  const response = await authFetch(`${URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ marks }),
  });
  await failOnError(response);

  const data: MarkResponse = await response.json();
  return data.mark;
}
