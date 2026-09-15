import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/feedback";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { Student } from "../store/studentsSlice";
import type { Course } from "../store/coursesSlice";
import type { StudentInput } from "../store/studentsApi";

// Mirrors the backend's createStudentSchema (validation/studentSchema.ts)
// — the photo is handled separately below, not through react-hook-form.
const studentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.number({ error: "Age is required" }).int().min(1).max(100),
  email: z.email("Enter a valid email"),
  phone: z.number({ error: "Phone is required" }),
  courses: z.array(z.string()).optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface AddStudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddStudent: (student: StudentInput) => Promise<void>;
  onUpdateStudent: (id: string, student: StudentInput) => Promise<void>;
  editingStudent: Student | null;
  availableCourses: Course[];
}

function AddStudentForm({
  open,
  onOpenChange,
  onAddStudent,
  onUpdateStudent,
  editingStudent,
  availableCourses,
}: AddStudentFormProps) {
  const isEditing = Boolean(editingStudent);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: { name: "", age: undefined, email: "", phone: undefined, courses: [] },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingStudent
          ? {
              name: editingStudent.name,
              age: editingStudent.age,
              email: editingStudent.email,
              phone: editingStudent.phone,
              courses: editingStudent.courses.map((c) => c._id),
            }
          : { name: "", age: undefined, email: "", phone: undefined, courses: [] },
      );
      setPhotoFile(null);
      setPhotoPreview(editingStudent?.avatar ?? null);
    }
  }, [open, editingStudent, form]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : (editingStudent?.avatar ?? null));
  }

  async function onSubmit(data: StudentFormData): Promise<void> {
    try {
      const input = { ...data, photo: photoFile ?? undefined };

      if (editingStudent) {
        await onUpdateStudent(editingStudent._id, input);
        toast.success("Student updated");
      } else {
        await onAddStudent(input);
        toast.success("Student added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update student"
            : "Failed to add student",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit student" : "Add student"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this student's details." : "Enter the details for the new student."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg">
                {photoPreview && <AvatarImage src={photoPreview} alt="Photo preview" />}
                <AvatarFallback>
                  <GraduationCap className="size-4" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer text-sm text-muted-foreground underline">
                {photoFile || editingStudent?.avatar ? "Change photo" : "Add a photo (optional)"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bikash Rai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="20"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="9800000000"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="student@school.edu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrolled courses</FormLabel>
                  <FormControl>
                    <ScrollArea className="h-32 rounded-md border p-3">
                      {availableCourses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No courses yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {availableCourses.map((course) => {
                            const checked = field.value?.includes(course._id) ?? false;
                            return (
                              <label key={course._id} className="flex items-center gap-2 text-sm font-normal">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(value) => {
                                    const current = field.value ?? [];
                                    field.onChange(
                                      value
                                        ? [...current, course._id]
                                        : current.filter((id) => id !== course._id),
                                    );
                                  }}
                                />
                                {course.name} <span className="text-muted-foreground">({course.code})</span>
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
                {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add student"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddStudentForm;
