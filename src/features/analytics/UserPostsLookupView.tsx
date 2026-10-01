import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { analyticsApi } from './analyticsApi';
import { usersApi } from '@/features/users/usersApi';
import { UserWithPostsResult } from '@/types/analytics.types';
import { User } from '@/types/user.types';
import { useAppSelector } from '@/redux/hooks';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatDate } from '@/utils/formatters';
import {
  Calendar,
  Share2,
  UserCheck,
  MessageSquare,
  Users,
  Search,
  X,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

export const UserPostsLookupView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useAppSelector((state) => state.auth.user);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  // Available users list
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    searchParams.get('userId') || currentUser?._id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');

  const [lookupResult, setLookupResult] = useState<UserWithPostsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Load all users for directory cards
  useEffect(() => {
    const loadUserOptions = async () => {
      try {
        setIsLoadingUsers(true);
        const res = await usersApi.getUsers({ limit: 100 });
        setUserOptions(res.data);
        if (!selectedUserId && res.data.length > 0) {
          const defaultId = currentUser?._id || res.data[0]._id;
          setSelectedUserId(defaultId);
        }
      } catch {
        if (currentUser) {
          setUserOptions([currentUser]);
          if (!selectedUserId) setSelectedUserId(currentUser._id);
        }
      } finally {
        setIsLoadingUsers(false);
      }
    };
    loadUserOptions();
  }, [currentUser, selectedUserId]);

  // Load single user's detailed profile and posts
  const loadLookupData = useCallback(async (userIdToFetch: string) => {
    if (!userIdToFetch) return;
    try {
      setIsLoading(true);
      const res = await analyticsApi.getUserPostsLookup(userIdToFetch);
      setLookupResult(res.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to load member activity');
      setLookupResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const idFromUrl = searchParams.get('userId');
    if (idFromUrl) {
      setSelectedUserId(idFromUrl);
      loadLookupData(idFromUrl);
    } else if (selectedUserId) {
      loadLookupData(selectedUserId);
    }
  }, [searchParams, selectedUserId, loadLookupData]);

  const handleUserSelect = (newId: string) => {
    setSelectedUserId(newId);
    setSearchParams({ userId: newId });
    // Smooth scroll down to details
    setTimeout(() => {
      detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
  };

  // Filter members by search query
  const filteredUsers = userOptions.filter((u) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const nameMatch = u.name.toLowerCase().includes(query);
    const emailMatch = u.email.toLowerCase().includes(query);
    const interestsMatch = u.interests?.some((i) => i.toLowerCase().includes(query));
    return nameMatch || emailMatch || interestsMatch;
  });

  // Role verification check (Admin Only)
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center p-6">
        <div className="rounded-full bg-rose-100 dark:bg-rose-950/60 p-4 text-rose-600 mb-4">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          This member activity dashboard is restricted to administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Member Activity
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Admin Only
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Click on any member card below to view their complete profile, interests, and published discussions.
          </p>
        </div>

        {/* Member Count Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-muted-foreground shadow-2xs self-start sm:self-auto">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{userOptions.length} Registered Members</span>
        </div>
      </div>

      {/* Member Cards Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-foreground">Member Directory</h2>
            <span className="text-xs text-muted-foreground">
              ({filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'})
            </span>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member by name or email..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid of Member Cards */}
        {isLoadingUsers ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-border/70 bg-card p-4 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-muted rounded w-24" />
                    <div className="h-2.5 bg-muted rounded w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-border/70 bg-muted/20 text-muted-foreground text-sm">
            No members match &quot;{searchQuery}&quot;. Try a different search term.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {filteredUsers.map((u) => {
              const isSelected = selectedUserId === u._id;
              const initials = u.name
                .split(' ')
                .map((n) => n[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'U';

              return (
                <div
                  key={u._id}
                  onClick={() => handleUserSelect(u._id)}
                  className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-md ring-2 ring-emerald-500/20'
                      : 'border border-border/80 bg-card hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Avatar & Role */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-sm text-white shadow-2xs ${
                            isSelected
                              ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 ring-2 ring-emerald-500/40'
                              : 'bg-gradient-to-tr from-emerald-700 to-emerald-500'
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="font-bold text-sm text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate flex items-center gap-1 font-mono">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{u.email}</span>
                          </p>
                        </div>
                      </div>

                      {u.role === 'admin' ? (
                        <Badge variant="admin" className="text-[10px] py-0 px-1.5 h-4 shrink-0 uppercase tracking-wider">
                          Admin
                        </Badge>
                      ) : (
                        <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                          Member
                        </span>
                      )}
                    </div>

                    {/* Interests tags preview */}
                    {u.interests && u.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {u.interests.slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/50 truncate max-w-[120px]"
                          >
                            {item}
                          </span>
                        ))}
                        {u.interests.length > 2 && (
                          <span className="text-[10px] text-muted-foreground font-medium self-center">
                            +{u.interests.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator Footer */}
                  <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Viewing Activity</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground group-hover:text-emerald-600 text-xs transition-colors">
                        <span>Click to view</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Member Detail View */}
      <div ref={detailSectionRef} className="pt-4 space-y-6">
        {isLoading ? (
          <Loader text="Loading member details and posts..." />
        ) : lookupResult ? (
          <div className="space-y-6">
            {/* User Profile Summary Card */}
            <Card className="border border-border/80 shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-muted/20 border-b border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-lg shadow-sm">
                      {lookupResult.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl font-bold">{lookupResult.name}</CardTitle>
                        <Badge variant={lookupResult.role === 'admin' ? 'admin' : 'secondary'}>
                          {lookupResult.role === 'admin' ? 'Administrator' : 'Community Member'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lookupResult.email}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2.5 py-1 rounded border border-border/60 self-start sm:self-auto">
                    ID: {lookupResult._id}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                  <div>
                    <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                      Member Since
                    </span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      {formatDate(lookupResult.createdAt)}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                      Interests & Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lookupResult.interests && lookupResult.interests.length > 0 ? (
                        lookupResult.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-0.5 rounded-md text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic text-xs">No topics listed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                      Total Posts Published
                    </span>
                    <span className="font-extrabold text-foreground text-base text-emerald-600 dark:text-emerald-400">
                      {lookupResult.posts.length} {lookupResult.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Published Posts Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  Published Posts & Discussions by {lookupResult.name}
                </h2>
              </div>

              {lookupResult.posts.length === 0 ? (
                <EmptyState
                  icon={Share2}
                  title="No posts yet"
                  description={`${lookupResult.name} has not published any posts or discussions yet.`}
                />
              ) : (
                <div className="space-y-3">
                  {lookupResult.posts.map((post) => (
                    <Card
                      key={post._id}
                      className="border border-border/80 hover:border-emerald-500/40 rounded-xl transition-all shadow-2xs hover:shadow-sm"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle className="text-base font-bold text-foreground">
                            {post.title}
                          </CardTitle>
                          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
                          {post.body}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={UserCheck}
            title="Member not found"
            description="Could not find profile details for the selected member."
          />
        )}
      </div>
    </div>
  );
};


