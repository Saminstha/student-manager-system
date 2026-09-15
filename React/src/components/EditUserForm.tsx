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
import { Checkbox } from "./ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/feedback";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import type { AppUser, UserRole } from "../store/usersSlice";
import type { UpdateUserInput } from "../store/usersApi";

// Mirrors the backend's updateUserSchema (validation/userSchema.ts) —
// only firstName, lastName, email and role can be changed here. Username
// and password aren't editable from this form. The photo is handled
// separately below, not through react-hook-form.
const editUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  role: z.array(z.string()).min(1, "Pick at least one role"),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateUser: (id: string, changes: UpdateUserInput) => Promise<void>;
  editingUser: AppUser | null;
  availableRoles: UserRole[];
}

function EditUserForm({
  open,
  onOpenChange,
  onUpdateUser,
  editingUser,
  availableRoles,
}: EditUserFormProps) {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { firstName: "", lastName: "", email: "", role: [] },
  });

  useEffect(() => {
    if (open && editingUser) {
      form.reset({
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role.map((r) => r.name),
      });
      setPhotoFile(null);
      setPhotoPreview(editingUser.avatar ?? null);
    }
  }, [open, editingUser, form]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : (editingUser?.avatar ?? null));
  }

  async function onSubmit(data: EditUserFormData): Promise<void> {
    if (!editingUser) return;

    try {
      await onUpdateUser(editingUser._id, { ...data, avatar: photoFile ?? undefined });
      toast.success("User updated");
      onOpenChange(false);
    } catch (err) {
      form.setError("root", {
        message: err instanceof Error ? err.message : "Failed to update user",
      });
    }
  }

  if (!editingUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update @{editingUser.username}'s details. Username and password can't be changed here.
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
                {photoFile || editingUser.avatar ? "Change photo" : "Add a photo (optional)"}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <div className="space-y-2 rounded-md border p-3">
                      {availableRoles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No roles found.</p>
                      ) : (
                        availableRoles.map((role) => {
                          const checked = field.value?.includes(role.name) ?? false;
                          return (
                            <label
                              key={role._id}
                              className="flex items-center gap-2 text-sm font-normal capitalize"
                            >
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(value) => {
                                  const current = field.value ?? [];
                                  field.onChange(
                                    value
                                      ? [...current, role.name]
                                      : current.filter((name) => name !== role.name),
                                  );
                                }}
                              />
                              {role.name}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root && (
              <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserForm;
