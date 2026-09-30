import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { postsApi } from './postsApi';
import { toast } from 'sonner';

const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  body: z.string().trim().min(1, 'Body content is required'),
});

export type PostFormData = z.infer<typeof postSchema>;

export interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      body: '',
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      setIsSubmitting(true);
      const res = await postsApi.createPost(data);
      toast.success(res.message || 'Post created successfully');
      reset();
      onPostCreated();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Social Post"
      description="Publish an update to the public social platform feed."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Post Title"
          placeholder="e.g. Announcing new cryptographic key exchange protocol"
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Post Content
          </label>
          <textarea
            rows={5}
            placeholder="Share insights, technical updates, or architectural announcements..."
            className="flex w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors resize-y font-sans"
            {...register('body')}
          />
          {errors.body?.message && (
            <p className="text-xs text-destructive font-medium">{errors.body.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Publish to Feed
          </Button>
        </div>
      </form>
    </Modal>
  );
};
