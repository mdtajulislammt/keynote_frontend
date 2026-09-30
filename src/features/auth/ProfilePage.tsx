import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchMeThunk } from './authThunks';
import { logout } from '@/redux/slices/authSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/formatters';
import { Mail, Shield, Calendar, Tag, LogOut, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await dispatch(fetchMeThunk());
    setIsRefreshing(false);
    toast.success('Profile refreshed');
  };

  useEffect(() => {
    dispatch(fetchMeThunk());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      <div className="border-b border-border/80 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Account Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your personal credentials, RBAC tier, and registered interest tags
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleRefresh} isLoading={isRefreshing} className="gap-1.5 font-semibold">
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>Refresh</span>
        </Button>
      </div>

      <Card className="border border-border/90 shadow-md bg-card">
        <CardHeader className="pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white text-2xl font-extrabold shadow-md shadow-emerald-600/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-2xl font-extrabold text-foreground">{user.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-1 text-sm">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>{user.email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                RBAC Access Tier
              </span>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <Badge variant={user.role === 'admin' ? 'admin' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1.5">
                Member Since
              </span>
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
              Registered Interests ($unwind group targets)
            </span>
            <div className="flex flex-wrap gap-2">
              {user.interests && user.interests.length > 0 ? (
                user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground italic">No interests specified</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-muted/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
              Database Identifier
            </span>
            <span className="font-mono text-sm font-semibold text-foreground select-all">{user._id}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-border/80 pt-5">
          <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2 font-semibold">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
