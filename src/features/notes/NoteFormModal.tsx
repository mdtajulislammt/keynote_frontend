import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Note } from '@/types/note.types';

const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string().trim().min(1, 'Content is required'),
});

export type NoteFormData = z.infer<typeof noteSchema>;

export interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => Promise<void>;
  initialData?: Note | null;
  isLoading?: boolean;
}

export const NoteFormModal: React.FC<NoteFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        content: initialData.content,
      });
    } else {
      reset({
        title: '',
        content: '',
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (data: NoteFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Note' : 'Create New Note'}
      description={
        isEditing
          ? 'Update the title or content of your personal note.'
          : 'Draft a private, secure note stored with compound index optimization.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Zero Trust Architecture Checklist"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Note Content
          </label>
          <textarea
            rows={6}
            placeholder="Write your secure note content here..."
            className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y font-sans"
            {...register('content')}
          />
          {errors.content?.message && (
            <p className="text-xs text-destructive font-medium">{errors.content.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
