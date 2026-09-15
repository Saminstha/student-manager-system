import { BookOpen, ClipboardList, MoreVertical, Pencil, Trash2, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/feedback";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/menu";
import type { Course } from "../store/coursesSlice";

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onManageMarks: () => void;
}

function CourseCard({ course, onEdit, onDelete, onManageMarks }: CourseCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
            <BookOpen className="size-4" />
          </div>
          <div>
            <p className="font-medium leading-none">{course.name}</p>
            <Badge variant="outline" className="mt-1">
              {course.code}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onManageMarks}>
              <ClipboardList className="size-4" /> Manage marks
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Taught by {course.teacher?.name ?? "Unassigned"}</p>
        <div className="flex items-center gap-2">
          <Users className="size-3.5" />
          <span>
            {course.students.length} student{course.students.length === 1 ? "" : "s"} enrolled
          </span>
        </div>
        <Button variant="secondary" size="sm" className="mt-1 w-full" onClick={onManageMarks}>
          <ClipboardList className="size-3.5" /> Manage marks
        </Button>
      </CardContent>
    </Card>
  );
}

export default CourseCard;
