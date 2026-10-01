import React, { useState } from 'react';
import { Note } from '@/types/note.types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { Calendar, Edit2, Trash2, Copy, Check, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

export interface NoteDetailsModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (note: Note) => void;
  onDelete?: (noteId: string) => void;
  isAdminView?: boolean;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  note,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isAdminView = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!note) return null;

  const authorName =
    typeof note.userId === 'object' && note.userId !== null
      ? note.userId.name
      : null;

  const handleCopy = () => {
    const fullText = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Note copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEditClick = () => {
    if (onEdit) {
      onClose();
      onEdit(note);
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onClose();
      onDelete(note._id);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      className="p-6 sm:p-7"
    >
      <div className="space-y-5">
        {/* Header & Metadata */}
        <div className="space-y-2 pr-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{formatDate(note.createdAt)}</span>
            </span>

            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                <Clock className="w-3 h-3" />
                <span>Edited</span>
              </span>
            )}

            {isAdminView && authorName && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Author:</span>
                <Badge variant="secondary" className="font-semibold text-xs">
                  {authorName}
                </Badge>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug break-words">
            {note.title}
          </h2>
        </div>

        {/* Content Divider */}
        <div className="h-px w-full bg-border/70" />

        {/* Description / Content Body */}
        <div className="max-h-[55vh] overflow-y-auto pr-1 rounded-lg">
          <div className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans selection:bg-emerald-500/20 selection:text-foreground">
            {note.content}
          </div>
        </div>

        {/* Footer Actions: Edit, Delete, Copy, Close */}
        <div className="pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Quick Copy Action */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground self-start sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </Button>

          {/* Edit, Delete, Close Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDeleteClick}
                className="gap-1.5 text-xs font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            )}

            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
              >
                <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edit Note</span>
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onClose}
              className="text-xs font-semibold px-4"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
