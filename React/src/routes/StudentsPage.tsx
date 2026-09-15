import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import CardGrid from "../components/CardGrid";
import StudentCard from "../components/StudentCard";
import AddStudentForm from "../components/AddStudentForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/overlay";
import useStudents from "../hooks/useStudents";
import useCourses from "../hooks/useCourses";
import type { Student } from "../store/studentsSlice";

function StudentsPage() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();
  const { courses } = useCourses();

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  function openAddForm(): void {
    setEditingStudent(null);
    setFormOpen(true);
  }

  function openEditForm(student: Student): void {
    setEditingStudent(student);
    setFormOpen(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!deletingStudent) return;
    await deleteStudent(deletingStudent._id);
    setDeletingStudent(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} student{students.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus /> Add student
        </Button>
      </div>

      <CardGrid
        loading={loading}
        error={error}
        isEmpty={students.length === 0}
        emptyMessage="No students yet. Add your first student to get started."
      >
        {students.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            onEdit={() => openEditForm(student)}
            onDelete={() => setDeletingStudent(student)}
          />
        ))}
      </CardGrid>

      <AddStudentForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onAddStudent={addStudent}
        onUpdateStudent={updateStudent}
        editingStudent={editingStudent}
        availableCourses={courses}
      />

      <AlertDialog open={Boolean(deletingStudent)} onOpenChange={(open) => !open && setDeletingStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingStudent?.name ?? "this student"}. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default StudentsPage;
