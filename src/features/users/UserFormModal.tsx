import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, CreateUserPayload, UpdateUserPayload } from '@/types/user.types';
import { usersApi } from './usersApi';
import { toast } from 'sonner';

const userModalSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().optional(),
  role: z.enum(['user', 'admin']),
  interestsRaw: z.string().optional(),
});

type UserModalFormData = z.infer<typeof userModalSchema>;

export interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userToEdit,
}) => {
  const isEditing = Boolean(userToEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserModalFormData>({
    resolver: zodResolver(userModalSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      interestsRaw: '',
    },
  });

  useEffect(() => {
    if (userToEdit) {
      reset({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        role: userToEdit.role,
        interestsRaw: userToEdit.interests?.join(', ') || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        password: '',
        role: 'user',
        interestsRaw: '',
      });
    }
  }, [userToEdit, reset, isOpen]);

  const onSubmit = async (data: UserModalFormData) => {
    // Validate password when creating a new user
    if (!isEditing && (!data.password || data.password.length < 8)) {
      toast.error('Password must be at least 8 characters long for new accounts');
      return;
    }

    const interests = data.interestsRaw
      ? data.interestsRaw
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    try {
      setIsSubmitting(true);
      if (isEditing && userToEdit) {
        const payload: UpdateUserPayload = {
          name: data.name,
          email: data.email,
          role: data.role,
          interests,
          ...(data.password ? { password: data.password } : {}),
        };
        await usersApi.updateUser(userToEdit._id, payload);
        toast.success('User updated successfully');
      } else {
        const payload: CreateUserPayload = {
          name: data.name,
          email: data.email,
          password: data.password!,
          role: data.role,
          interests,
        };
        await usersApi.createUser(payload);
        toast.success('User created successfully');
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit User: ${userToEdit?.name}` : 'Create New User (Admin)'}
      description={
        isEditing
          ? 'Modify account credentials, role assignment, and interest tags.'
          : 'Provision a new user account with designated role and permissions.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={isEditing ? 'New Password (leave blank to keep unchanged)' : 'Password (min 8 chars)'}
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Assigned Role
          </label>
          <select
            className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            {...register('role')}
          >
            <option value="user">User (Standard Access)</option>
            <option value="admin">Admin (Full RBAC Management)</option>
          </select>
        </div>

        <Input
          label="Interests (Comma-separated)"
          placeholder="Cybersecurity, Cloud, Devops"
          helperText="Feeds into interest aggregation analytics"
          error={errors.interestsRaw?.message}
          {...register('interestsRaw')}
        />

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            {isEditing ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
