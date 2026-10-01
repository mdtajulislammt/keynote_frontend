import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check RBAC role
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="rounded-full bg-red-100 dark:bg-red-950 p-4 text-destructive mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Access Denied (403 Forbidden)</h1>
        <p className="text-sm text-muted-foreground max-w-md mt-2 mb-6">
          This administrative resource is restricted. Your current account role is{' '}
          <span className="font-semibold text-foreground uppercase">{user?.role || 'user'}</span>, which does not have administrator permissions.
        </p>
        <div className="flex gap-3">
          <Link to="/notes">
            <Button size="sm">Go to My Notes</Button>
          </Link>
          <Link to="/posts">
            <Button variant="outline" size="sm">
              Public Feed
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
