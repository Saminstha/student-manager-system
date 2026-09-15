import { useState } from "react";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "../components/ui/feedback";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/feedback";
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
import EditUserForm from "../components/EditUserForm";
import useUsers from "../hooks/useUsers";
import useRoles from "../hooks/useRoles";
import type { AppUser } from "../store/usersSlice";

function initials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

function UsersPage() {
  const { users, loading, error, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();

  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete(): Promise<void> {
    if (!deletingUser) return;

    setIsDeleting(true);
    try {
      await deleteUser(deletingUser._id);
      setDeletingUser(null);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          {users.length} account{users.length === 1 ? "" : "s"} — manage roles and details here.
        </p>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="text-sm text-destructive">
          {error}
          {error.toLowerCase().includes("permission") && (
            <span className="mt-1 block text-muted-foreground">
              Ask an admin to grant your account the "user:read" permission — see the
              "npm run promote:admin" script.
            </span>
          )}
        </p>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
          <UserRound className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No users yet.</p>
        </div>
      )}

      {!loading && !error && users.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        {user.avatar && <AvatarImage src={user.avatar} alt={user.username} />}
                        <AvatarFallback>{initials(user.firstName, user.lastName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.role.map((role) => (
                        <Badge key={role._id} variant="secondary" className="capitalize">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeletingUser(user)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EditUserForm
        open={Boolean(editingUser)}
        onOpenChange={(open) => !open && setEditingUser(null)}
        onUpdateUser={updateUser}
        editingUser={editingUser}
        availableRoles={roles}
      />

      <AlertDialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete @{deletingUser?.username ?? "this user"}'s account. This
              can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UsersPage;
