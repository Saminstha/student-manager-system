import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import CardGrid from "../components/CardGrid";
import TeacherCard from "../components/TeacherCard";
import AddTeacherForm from "../components/AddTeacherForm";
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
import useTeachers from "../hooks/useTeachers";
import type { Teacher } from "../store/teachersSlice";

function TeachersPage() {
  const { teachers, loading, error, addTeacher, updateTeacher, deleteTeacher } = useTeachers();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  function openAddForm(): void {
    setEditingTeacher(null);
    setFormOpen(true);
  }

  function openEditForm(teacher: Teacher): void {
    setEditingTeacher(teacher);
    setFormOpen(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!deletingTeacher) return;
    await deleteTeacher(deletingTeacher._id);
    setDeletingTeacher(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            {teachers.length} teacher{teachers.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus /> Add teacher
        </Button>
      </div>

      <CardGrid
        loading={loading}
        error={error}
        isEmpty={teachers.length === 0}
        emptyMessage="No teachers yet. Add your first teacher to get started."
      >
        {teachers.map((teacher) => (
          <TeacherCard
            key={teacher._id}
            teacher={teacher}
            onEdit={() => openEditForm(teacher)}
            onDelete={() => setDeletingTeacher(teacher)}
          />
        ))}
      </CardGrid>

      <AddTeacherForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onAddTeacher={addTeacher}
        onUpdateTeacher={updateTeacher}
        editingTeacher={editingTeacher}
      />

      <AlertDialog open={Boolean(deletingTeacher)} onOpenChange={(open) => !open && setDeletingTeacher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingTeacher?.name ?? "this teacher"}. This can't be undone.
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

export default TeachersPage;
