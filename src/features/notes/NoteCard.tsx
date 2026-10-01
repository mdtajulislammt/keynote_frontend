import React from 'react';
import { Note } from '@/types/note.types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { FileText, Calendar, Edit2, Trash2, User } from 'lucide-react';

export interface NoteCardProps {
  note: Note;
  onClick?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  isAdminView?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  onEdit,
  onDelete,
  isAdminView = false,
}) => {
  const authorName =
    typeof note.userId === 'object' && note.userId !== null
      ? note.userId.name
      : null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(note);
    }
  };

  return (
    <Card
      onClick={() => onClick?.(note)}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`flex flex-col h-full bg-card hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-1 transition-all duration-300 group ${
        onClick ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <FileText className="w-5 h-5" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold leading-tight line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {note.title}
            </CardTitle>
          </div>
        </div>

        {isAdminView && authorName && (
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Author:</span>
            <Badge variant="secondary">
              {authorName}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-5 leading-relaxed font-sans">
          {note.content}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-4 h-4 text-emerald-600/70" />
          <span>{formatDate(note.createdAt)}</span>
        </div>

        <div className="flex items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              title="Edit Note"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/40"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note._id);
              }}
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
