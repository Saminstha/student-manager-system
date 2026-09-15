import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/overlay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { Course } from "../store/coursesSlice";
import type { CourseInput } from "../store/coursesApi";
import type { Teacher } from "../store/teachersSlice";
import type { Student } from "../store/studentsSlice";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select one");

// Mirrors the backend's createCourseSchema (validation/courseSchema.ts)
const courseSchema = z.object({
  name: z.string().trim().min(1, "Course name is required"),
  code: z.string().trim().min(1, "Course code is required"),
  teacher: objectId,
  students: z.array(objectId).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface AddCourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCourse: (course: CourseInput) => Promise<void>;
  onUpdateCourse: (id: string, course: CourseInput) => Promise<void>;
  editingCourse: Course | null;
  availableTeachers: Teacher[];
  availableStudents: Student[];
}

function AddCourseForm({
  open,
  onOpenChange,
  onAddCourse,
  onUpdateCourse,
  editingCourse,
  availableTeachers,
  availableStudents,
}: AddCourseFormProps) {
  const isEditing = Boolean(editingCourse);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { name: "", code: "", teacher: "", students: [] },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingCourse
          ? {
              name: editingCourse.name,
              code: editingCourse.code,
              teacher: editingCourse.teacher?._id ?? "",
              students: editingCourse.students.map((s) => s._id),
            }
          : { name: "", code: "", teacher: "", students: [] },
      );
    }
  }, [open, editingCourse, form]);

  async function onSubmit(data: CourseFormData): Promise<void> {
    try {
      if (editingCourse) {
        await onUpdateCourse(editingCourse._id, data);
        toast.success("Course updated");
      } else {
        await onAddCourse(data);
        toast.success("Course added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update course"
            : "Failed to add course",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit course" : "Add course"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this course's details." : "Enter the details for the new course."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course name</FormLabel>
                    <FormControl>
                      <Input placeholder="Data Structures" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course code</FormLabel>
                    <FormControl>
                      <Input placeholder="CS201" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="teacher"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTeachers.map((t) => (
                        <SelectItem key={t._id} value={t._id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="students"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrolled students</FormLabel>
                  <FormControl>
                    <ScrollArea className="h-32 rounded-md border p-3">
                      {availableStudents.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No students yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {availableStudents.map((s) => {
                            const checked = field.value?.includes(s._id) ?? false;
                            return (
                              <label key={s._id} className="flex items-center gap-2 text-sm font-normal">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => {
                                    const current = field.value ?? [];
                                    field.onChange(
                                      value
                                        ? [...current, s._id]
                                        : current.filter((id) => id !== s._id),
                                    );
                                  }}
                                />
                                {s.name}
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </ScrollArea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddCourseForm;
