import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { loginThunk } from './authThunks';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/notes';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'dev.tajulislam505@gmail.com',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const resultAction = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(resultAction)) {
      navigate(from, { replace: true });
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
            <CardTitle className="text-2xl font-extrabold tracking-tight">Sign In to Your Account</CardTitle>
            <CardDescription className="text-sm mt-1">
              Enter your credentials to access your Keynote vault and admin dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="p-3.5 text-sm rounded-lg bg-destructive/10 border border-destructive/20 text-destructive font-semibold">
                {error}
              </div>
            )}

            <Input
              label="Admin / User Email"
              type="email"
              placeholder="dev.tajulislam505@gmail.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Account Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              className="w-full h-11 text-base font-bold mt-2 shadow-md shadow-emerald-700/20"
              isLoading={isLoading}
            >
              Sign In to Keynote
            </Button>
          </form>

          {/* Admin Credentials Quick Hint */}
          <div className="mt-6 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Configured Admin Account:</span>
            </div>
            <p className="text-muted-foreground">
              Email: <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-300">dev.tajulislam505@gmail.com</code> (Role: <span className="font-bold uppercase text-emerald-600">admin</span>)
            </p>
            <p className="text-muted-foreground text-[11px]">
              Use the password you entered when registering this account.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/80 py-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Register a new account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
