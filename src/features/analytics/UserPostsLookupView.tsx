import React, { useState, useEffect, useCallback } from 'react';
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
import { Calendar, Share2, Layers, Network } from 'lucide-react';
import { toast } from 'sonner';

export const UserPostsLookupView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUser = useAppSelector((state) => state.auth.user);

  // Available users list for the selector
  const [userOptions, setUserOptions] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>(
    searchParams.get('userId') || currentUser?._id || ''
  );

  const [lookupResult, setLookupResult] = useState<UserWithPostsResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUserOptions = async () => {
      try {
        const res = await usersApi.getUsers({ limit: 50 });
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
      }
    };
    loadUserOptions();
  }, [currentUser, selectedUserId]);

  const loadLookupData = useCallback(async (userIdToFetch: string) => {
    if (!userIdToFetch) return;
    try {
      setIsLoading(true);
      const res = await analyticsApi.getUserPostsLookup(userIdToFetch);
      setLookupResult(res.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to execute $lookup aggregation');
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
  };

  return (
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              User Posts ($lookup)
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Scenario 2: $match + $lookup
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            MongoDB aggregation pipeline querying a user and embedding all their posts via a relational $lookup stage
          </p>
        </div>

        {/* User Picker */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <label className="text-sm font-bold text-foreground shrink-0">Target User:</label>
          <select
            value={selectedUserId}
            onChange={(e) => handleUserSelect(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 py-1 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {userOptions.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipeline Technical Specification Card */}
      <div className="bg-emerald-500/5 border border-emerald-500/30 p-5 rounded-xl space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>MongoDB Pipeline Specification</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Backend queries the <code className="font-mono bg-white dark:bg-black/60 px-2 py-0.5 rounded text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">users</code> collection:{' '}
          <code className="font-mono bg-white dark:bg-black/60 px-2 py-0.5 rounded text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            $match: &#123; _id: ObjectId(userId) &#125; → $lookup: &#123; from: &quot;posts&quot;, localField: &quot;_id&quot;, foreignField: &quot;userId&quot;, as: &quot;posts&quot; &#125;
          </code>
        </p>
      </div>

      {isLoading ? (
        <Loader text="Executing MongoDB $lookup aggregation..." />
      ) : lookupResult ? (
        <div className="space-y-6">
          {/* User Profile Summary Card */}
          <Card className="border border-border/80 shadow-md">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-lg shadow-sm">
                    {lookupResult.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{lookupResult.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lookupResult.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Badge variant={lookupResult.role === 'admin' ? 'admin' : 'secondary'}>
                    {lookupResult.role}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2 py-1 rounded">
                    ID: {lookupResult._id}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm pt-4 border-t border-border/60">
                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                    Registration Date
                  </span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {formatDate(lookupResult.createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                    User Interests
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
                      <span className="text-muted-foreground italic text-xs">None listed</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-xs font-semibold uppercase tracking-wider mb-1">
                    Lookup Posts Count
                  </span>
                  <span className="font-extrabold text-foreground text-base font-mono text-emerald-600 dark:text-emerald-400">
                    {lookupResult.posts.length} {lookupResult.posts.length === 1 ? 'post' : 'posts'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Joined Posts Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <span>Aggregated Posts from &quot;posts&quot; Collection</span>
            </h2>

            {lookupResult.posts.length === 0 ? (
              <EmptyState
                icon={Share2}
                title="No posts found for this user"
                description={`${lookupResult.name} has not authored any posts in the posts collection yet.`}
              />
            ) : (
              <div className="space-y-4">
                {lookupResult.posts.map((post) => (
                  <Card key={post._id} className="border border-border hover:border-emerald-500/40 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-base font-bold text-foreground">{post.title}</CardTitle>
                        <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
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
          icon={Network}
          title="User not found"
          description="Could not load lookup aggregation for the selected user ID."
        />
      )}
    </div>
  );
};
