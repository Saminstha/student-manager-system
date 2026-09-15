import type { ReactNode } from "react";
import { Skeleton } from "./ui/feedback";

interface CardGridProps {
  loading: boolean;
  error: string;
  isEmpty: boolean;
  emptyMessage: string;
  children: ReactNode;
}

// Generic grid wrapper shared by the Students, Teachers and Courses pages.
// Handles the loading / error / empty states so each page only has to
// render its own cards.
function CardGrid({ loading, error, isEmpty, emptyMessage, children }: CardGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export default CardGrid;
