import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { registerThunk } from './authThunks';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long').max(128),
  interestsRaw: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      interestsRaw: 'Cybersecurity, Cloud Infrastructure, AI Safety',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const interests = data.interestsRaw
      ? data.interestsRaw
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    const resultAction = await dispatch(
      registerThunk({
        name: data.name,
        email: data.email,
        password: data.password,
        interests,
      })
    );

    if (registerThunk.fulfilled.match(resultAction)) {
      navigate('/notes', { replace: true });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-10">
      <Card className="border border-border/90 shadow-xl bg-card">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="flex justify-center">
            <BrandLogo size="lg" asLink={false} showTagline={true} />
          </div>
          <div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Create Your Account</CardTitle>
            <CardDescription className="text-sm mt-1">
              Join Keynote to manage encrypted notes and social posts
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3.5 text-sm rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="e.g. John Connor"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@resistance.org"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password (min 8 characters)"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Interests (Comma-separated for analytics)"
              placeholder="Cybersecurity, AI Safety, Cryptography"
              helperText="These tags feed into MongoDB $unwind & $group aggregation analytics"
              error={errors.interestsRaw?.message}
              {...register('interestsRaw')}
            />

            <Button type="submit" className="w-full h-11 text-base font-bold mt-2 shadow-md shadow-emerald-700/20" isLoading={isLoading}>
              Create Keynote Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/80 py-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
