import { Mail, MoreVertical, Pencil, Phone, Trash2, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/feedback";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/menu";
import type { Teacher } from "../store/teachersSlice";

interface TeacherCardProps {
  teacher: Teacher;
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

function TeacherCard({ teacher, onEdit, onDelete }: TeacherCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <Avatar>
            {teacher.avatar && <AvatarImage src={teacher.avatar} alt={teacher.name} />}
            <AvatarFallback>{initials(teacher.name) || <UserRound className="size-4" />}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium leading-none">{teacher.name}</p>
            <p className="text-xs text-muted-foreground">Age {teacher.age}</p>
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
      <CardContent className="space-y-1.5 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Mail className="size-3.5" />
          <span className="truncate">{teacher.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="size-3.5" />
          <span>{teacher.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TeacherCard;
