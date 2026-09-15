import { GraduationCap, Mail, MoreVertical, Pencil, Phone, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "./ui/feedback";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/menu";
import type { Student } from "../store/studentsSlice";

interface StudentCardProps {
  student: Student;
  onEdit: () => void;
  onDelete: () => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function StudentCard({ student, onEdit, onDelete }: StudentCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar>
            {student.avatar && <AvatarImage src={student.avatar} alt={student.name} />}
            <AvatarFallback>{initials(student.name) || <GraduationCap className="size-4" />}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none">{student.name}</p>
            <p className="text-xs text-muted-foreground">Age {student.age}</p>
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
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="size-3.5" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-3.5" />
          <span>{student.phone}</span>
        </div>
        {student.courses.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {student.courses.map((c) => (
              <Badge key={c._id} variant="secondary">
                {c.code}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StudentCard;
