import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { notesApi } from './notesApi';
import { useAppDispatch } from '@/redux/hooks';
import { createNoteThunk, updateNoteThunk } from './notesThunks';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/common/Loader';
import {
  ArrowLeft,
  Save,
  FileText,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Please give your note a title')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string().trim().min(1, 'Please write some content for your note'),
});

type NoteFormData = z.infer<typeof noteSchema>;

export const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoadingNote, setIsLoadingNote] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const contentValue = watch('content') || '';
  const wordCount = contentValue.trim() ? contentValue.trim().split(/\s+/).length : 0;
  const charCount = contentValue.length;

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const loadNote = async () => {
      try {
        setIsLoadingNote(true);
        const res = await notesApi.getNoteById(id);
        if (isMounted && res.data) {
          reset({
            title: res.data.title,
            content: res.data.content,
          });
        }
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Could not fetch note');
        navigate('/notes');
      } finally {
        if (isMounted) setIsLoadingNote(false);
      }
    };

    loadNote();
    return () => {
      isMounted = false;
    };
  }, [id, reset, navigate]);

  const onSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await dispatch(updateNoteThunk({ id, payload: data })).unwrap();
        toast.success('Note updated successfully');
      } else {
        await dispatch(createNoteThunk(data)).unwrap();
        toast.success('Note published to your workspace');
      }
      navigate('/notes');
    } catch {
      // Error handled in toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcut Ctrl+S or Cmd+S to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  if (isLoadingNote) {
    return <Loader text="Loading note details..." />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6" onKeyDown={handleKeyDown}>
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <Link to="/notes">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground h-9"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Notes</span>
            </Button>
          </Link>

          <div className="h-4 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {isEditing ? 'Editing Note' : 'Drafting Note'}
            </span>
            <span>•</span>
            <span className="font-mono">{wordCount} words</span>
            <span>•</span>
            <span className="font-mono">{charCount} characters</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <Link to="/notes">
            <Button type="button" variant="ghost" size="sm" className="h-9 px-3 text-xs">
              Discard
            </Button>
          </Link>

          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
            size="sm"
            className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Save Note'}</span>
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Note Title Input */}
          <div className="space-y-1">
            <input
              type="text"
              autoFocus
              placeholder="Note title..."
              className="w-full text-2xl sm:text-3xl font-extrabold text-foreground placeholder:text-muted-foreground/40 bg-transparent border-0 outline-none focus:ring-0 p-0 transition-colors"
              {...register('title')}
            />
            {errors.title?.message && (
              <p className="text-xs text-destructive font-medium pt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="h-px w-full bg-border/60" />

          {/* Note Content Textarea */}
          <div className="space-y-1">
            <textarea
              rows={16}
              placeholder="Start writing your thoughts, ideas, plans, or research notes here..."
              className="w-full text-base sm:text-lg text-foreground/90 placeholder:text-muted-foreground/40 bg-transparent border-0 outline-none focus:ring-0 p-0 leading-relaxed font-sans resize-y min-h-[360px]"
              {...register('content')}
            />
            {errors.content?.message && (
              <p className="text-xs text-destructive font-medium pt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Bottom Toolbar & Shortcuts */}
          <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plain text & markdown supported</span>
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground/80">
              <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-foreground font-semibold">
                Ctrl + S
              </kbd>
              <span>to quick save</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

