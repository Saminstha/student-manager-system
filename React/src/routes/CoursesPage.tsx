import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import CardGrid from "../components/CardGrid";
import CourseCard from "../components/CourseCard";
import AddCourseForm from "../components/AddCourseForm";
import ManageMarksDialog from "../components/ManageMarksDialog";
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
import useCourses from "../hooks/useCourses";
import useTeachers from "../hooks/useTeachers";
import useStudents from "../hooks/useStudents";
import useMarks from "../hooks/useMarks";
import type { Course } from "../store/coursesSlice";

function CoursesPage() {
  const { courses, loading, error, addCourse, updateCourse, deleteCourse } = useCourses();
  const { teachers } = useTeachers();
  const { students } = useStudents();
  const { marks, addMark, updateMark, deleteMark } = useMarks();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
  const [marksCourse, setMarksCourse] = useState<Course | null>(null);
  const [marksOpen, setMarksOpen] = useState(false);

  function openAddForm(): void {
    setEditingCourse(null);
    setFormOpen(true);
  }

  function openEditForm(course: Course): void {
    setEditingCourse(course);
    setFormOpen(true);
  }

  function openMarks(course: Course): void {
    setMarksCourse(course);
    setMarksOpen(true);
  }

  async function confirmDelete(): Promise<void> {
    if (!deletingCourse) return;
    await deleteCourse(deletingCourse._id);
    setDeletingCourse(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </p>
        </div>
        <Button onClick={openAddForm}>
          <Plus /> Add course
        </Button>
      </div>

      <CardGrid
        loading={loading}
        error={error}
        isEmpty={courses.length === 0}
        emptyMessage="No courses yet. Add your first course to get started."
      >
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={() => openEditForm(course)}
            onDelete={() => setDeletingCourse(course)}
            onManageMarks={() => openMarks(course)}
          />
        ))}
      </CardGrid>

      <AddCourseForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onAddCourse={addCourse}
        onUpdateCourse={updateCourse}
        editingCourse={editingCourse}
        availableTeachers={teachers}
        availableStudents={students}
      />

      <ManageMarksDialog
        open={marksOpen}
        onOpenChange={setMarksOpen}
        course={marksCourse}
        marks={marks}
        onAddMark={addMark}
        onUpdateMark={updateMark}
        onDeleteMark={deleteMark}
      />

      <AlertDialog open={Boolean(deletingCourse)} onOpenChange={(open) => !open && setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {deletingCourse?.name ?? "this course"}. This can't be undone.
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

export default CoursesPage;
