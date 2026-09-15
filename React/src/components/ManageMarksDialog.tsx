import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import type { Course } from "../store/coursesSlice";
import type { Mark } from "../store/marksSlice";
import type { MarkInput } from "../store/marksApi";

// Mirrors the backend's createMarkSchema (validation/markSchema.ts)
const markSchema = z.object({
  student: z.string().regex(/^[0-9a-fA-F]{24}$/, "Select a student"),
  marks: z.number({ error: "Marks is required" }).min(0, "Min 0").max(100, "Max 100"),
});

type MarkFormData = z.infer<typeof markSchema>;

interface ManageMarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  marks: Mark[];
  onAddMark: (mark: MarkInput) => Promise<void>;
  onUpdateMark: (id: string, marks: number) => Promise<void>;
  onDeleteMark: (id: string) => Promise<void>;
}

function ManageMarksDialog({
  open,
  onOpenChange,
  course,
  marks,
  onAddMark,
  onUpdateMark,
  onDeleteMark,
}: ManageMarksDialogProps) {
  const [editingMarkId, setEditingMarkId] = useState<string | null>(null);

  const form = useForm<MarkFormData>({
    resolver: zodResolver(markSchema),
    defaultValues: { student: "", marks: undefined },
  });

  if (!course) {
    return null;
  }

  const courseMarks = marks.filter((m) => m.course === course._id);

  async function onSubmit(data: MarkFormData): Promise<void> {
    try {
      await onAddMark({ student: data.student, course: course!._id, marks: data.marks });
      toast.success("Mark recorded");
      form.reset({ student: "", marks: undefined });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to record mark");
    }
  }

  async function handleUpdateMark(markId: string, value: number): Promise<void> {
    try {
      await onUpdateMark(markId, value);
      toast.success("Mark updated");
      setEditingMarkId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update mark");
    }
  }

  async function handleDeleteMark(markId: string): Promise<void> {
    try {
      await onDeleteMark(markId);
      toast.success("Mark removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove mark");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Marks — {course.name}</DialogTitle>
          <DialogDescription>
            Record and manage scores for students enrolled in this course.
          </DialogDescription>
        </DialogHeader>

        {courseMarks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead className="w-28">Marks</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseMarks.map((mark) => {
                const student = course.students.find((s) => s._id === mark.student);
                return (
                  <TableRow key={mark._id}>
                    <TableCell>{student?.name ?? "Unknown student"}</TableCell>
                    <TableCell>
                      {editingMarkId === mark._id ? (
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          defaultValue={mark.marks}
                          autoFocus
                          onBlur={(e) => handleUpdateMark(mark._id, Number(e.target.value))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateMark(mark._id, Number(e.currentTarget.value));
                            }
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          className="rounded px-2 py-1 text-left hover:bg-muted"
                          onClick={() => setEditingMarkId(mark._id)}
                        >
                          {mark.marks}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => handleDeleteMark(mark._id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No marks recorded yet.</p>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 border-t pt-4">
            <FormField
              control={form.control}
              name="student"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {course.students.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          Enroll students in this course first
                        </div>
                      ) : (
                        course.students.map((s) => (
                          <SelectItem key={s._id} value={s._id}>
                            {s.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="marks"
              render={({ field }) => (
                <FormItem className="w-24">
                  <FormLabel>Marks</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={100}
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
            <Button type="submit" disabled={course.students.length === 0}>
              <Plus /> Add
            </Button>
          </form>
        </Form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ManageMarksDialog;
