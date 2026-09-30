import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { notesApi } from './notesApi';
import { useAppDispatch } from '@/redux/hooks';
import { createNoteThunk, updateNoteThunk } from './notesThunks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/common/Loader';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  content: z.string().trim().min(1, 'Content is required'),
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
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

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
      } else {
        await dispatch(createNoteThunk(data)).unwrap();
      }
      navigate('/notes');
    } catch {
      // Error handled in toast
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingNote) {
    return <Loader text="Loading note details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/notes">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground font-semibold">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Notes</span>
          </Button>
        </Link>
      </div>

      <Card className="border border-border/90 shadow-md bg-card">
        <CardHeader className="pb-5">
          <CardTitle className="text-2xl font-extrabold tracking-tight">
            {isEditing ? 'Edit Note' : 'Create New Note'}
          </CardTitle>
          <CardDescription className="text-sm">
            {isEditing
              ? 'Update the title and content of your existing note.'
              : 'Write a new personal note with secure compound-index persistence.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Note Title"
              placeholder="e.g. Distributed Database Architecture Notes"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold tracking-wide text-foreground">
                Note Content
              </label>
              <textarea
                rows={12}
                placeholder="Write markdown or plain text note content..."
                className="flex w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y font-sans leading-relaxed shadow-2xs"
                {...register('content')}
              />
              {errors.content?.message && (
                <p className="text-xs text-destructive font-medium">{errors.content.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-5 border-t border-border">
              <Link to="/notes">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" size="sm" isLoading={isSubmitting} className="gap-2 font-bold shadow-md shadow-emerald-700/20">
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Note'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
