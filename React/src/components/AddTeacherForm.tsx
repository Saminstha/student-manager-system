import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserRound } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/feedback";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { Teacher } from "../store/teachersSlice";
import type { TeacherInput } from "../store/teachersApi";

// Mirrors the backend's createTeacherSchema (validation/teacherSchema.ts)
// — the photo is handled separately below, not through react-hook-form.
const teacherSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  age: z.number({ error: "Age is required" }).int().min(1).max(100),
  email: z.email("Enter a valid email"),
  phone: z.number({ error: "Phone is required" }),
});

type TeacherFormData = z.infer<typeof teacherSchema>;

interface AddTeacherFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTeacher: (teacher: TeacherInput) => Promise<void>;
  onUpdateTeacher: (id: string, teacher: TeacherInput) => Promise<void>;
  editingTeacher: Teacher | null;
}

function AddTeacherForm({
  open,
  onOpenChange,
  onAddTeacher,
  onUpdateTeacher,
  editingTeacher,
}: AddTeacherFormProps) {
  const isEditing = Boolean(editingTeacher);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { name: "", age: undefined, email: "", phone: undefined },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        editingTeacher
          ? {
              name: editingTeacher.name,
              age: editingTeacher.age,
              email: editingTeacher.email,
              phone: editingTeacher.phone,
            }
          : { name: "", age: undefined, email: "", phone: undefined },
      );
      setPhotoFile(null);
      setPhotoPreview(editingTeacher?.avatar ?? null);
    }
  }, [open, editingTeacher, form]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : (editingTeacher?.avatar ?? null));
  }

  async function onSubmit(data: TeacherFormData): Promise<void> {
    try {
      const input = { ...data, photo: photoFile ?? undefined };

      if (editingTeacher) {
        await onUpdateTeacher(editingTeacher._id, input);
        toast.success("Teacher updated");
      } else {
        await onAddTeacher(input);
        toast.success("Teacher added");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : isEditing
            ? "Failed to update teacher"
            : "Failed to add teacher",
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit teacher" : "Add teacher"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this teacher's details." : "Enter the details for the new teacher."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar size="lg">
                {photoPreview && <AvatarImage src={photoPreview} alt="Photo preview" />}
                <AvatarFallback>
                  <UserRound className="size-4" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer text-sm text-muted-foreground underline">
                {photoFile || editingTeacher?.avatar ? "Change photo" : "Add a photo (optional)"}
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
                    <Input placeholder="e.g. Priya Thapa" {...field} />
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
                        placeholder="30"
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
                    <Input type="email" placeholder="teacher@school.edu" {...field} />
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
                {form.formState.isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add teacher"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTeacherForm;
