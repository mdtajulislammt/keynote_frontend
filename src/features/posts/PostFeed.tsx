import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postsApi } from './postsApi';
import { Post } from '@/types/post.types';
import { PaginationMeta } from '@/types/api.types';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PaginationControl } from '@/components/common/PaginationControl';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/redux/hooks';
import {
  Plus,
  FilterX,
  Search,
  X,
  RotateCw,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';

export const PostFeed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get('userId') || undefined;

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync tab with filterUserId
  useEffect(() => {
    if (filterUserId && user?._id && filterUserId === user._id) {
      setActiveTab('my');
    } else if (!filterUserId) {
      setActiveTab('all');
    }
  }, [filterUserId, user]);

  const loadPosts = useCallback(
    async (showRefreshIndicator = false) => {
      try {
        if (showRefreshIndicator) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const res = await postsApi.getPosts({
          page,
          limit,
          userId: filterUserId,
        });

        setPosts(res.data);
        if (res.meta) setMeta(res.meta);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Could not fetch posts feed');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [page, limit, filterUserId]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleTabChange = (tab: 'all' | 'my') => {
    setActiveTab(tab);
    setPage(1);
    const nextParams = new URLSearchParams(searchParams);
    if (tab === 'my') {
      if (!isAuthenticated || !user?._id) {
        toast.info('Please sign in to view your posts');
        navigate('/login');
        return;
      }
      nextParams.set('userId', user._id);
    } else {
      nextParams.delete('userId');
    }
    setSearchParams(nextParams);
  };

  const handleFilterAuthor = (authorId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('userId', authorId);
    setSearchParams(nextParams);
    setPage(1);
  };

  const clearFilter = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('userId');
    setSearchParams(nextParams);
    setActiveTab('all');
    setPage(1);
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to publish posts');
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(term);
    const bodyMatch = p.body.toLowerCase().includes(term);
    const authorName =
      typeof p.userId === 'object' && p.userId !== null ? p.userId.name.toLowerCase() : '';
    return titleMatch || bodyMatch || authorName.includes(term);
  });

  const currentUserInitials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="space-y-6 w-full">
      {/* Sleek, Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Feed
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Community
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Explore discussions, thoughts, and announcements from the community.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadPosts(true)}
            disabled={isLoading || isRefreshing}
            className="h-9 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            title="Refresh feed"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleCreateClick}
            className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Post</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Feed stream & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Main Feed Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Quick-Compose Prompt Bar */}
          <div
            onClick={handleCreateClick}
            className="cursor-pointer rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs shadow-2xs">
                  {currentUserInitials}
                </div>
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-xs">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}

              <div className="flex-1 rounded-lg bg-muted/50 border border-border/60 px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                What's on your mind? Share an update or discussion...
              </div>

              <Button size="sm" className="hidden sm:flex h-8 px-3 text-xs gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Post</span>
              </Button>
            </div>
          </div>

          {/* Filter Bar: Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Tabs */}
            <div className="flex items-center p-1 rounded-lg bg-muted/60 border border-border/70 self-start">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'all' && !filterUserId
                    ? 'bg-card text-foreground shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All Posts
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => handleTabChange('my')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    activeTab === 'my'
                      ? 'bg-card text-emerald-600 dark:text-emerald-400 shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  My Posts
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-border/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Active Author Filter Pill */}
          {filterUserId && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
              <span className="font-medium">
                {activeTab === 'my' ? 'Viewing your own posts' : 'Filtering posts by selected author'}
              </span>
              <button
                type="button"
                onClick={clearFilter}
                className="inline-flex items-center gap-1 font-semibold hover:underline"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Show all</span>
              </button>
            </div>
          )}

          {/* Posts Stream */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border/70 bg-card p-5 space-y-3 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3.5 bg-muted rounded w-28" />
                      <div className="h-2.5 bg-muted rounded w-20" />
                    </div>
                  </div>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={searchTerm ? 'No matching posts' : 'Feed is quiet'}
              description={
                searchTerm
                  ? `No posts matched "${searchTerm}". Try a different keyword.`
                  : 'Be the first to publish a post to kick off the discussion.'
              }
              actionLabel="Create Post"
              onAction={handleCreateClick}
            />
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onFilterAuthor={handleFilterAuthor}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {meta && meta.total > 0 && (
            <PaginationControl
              meta={meta}
              onPageChange={(p) => setPage(p)}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Right Sidebar Widgets */}
        <aside className="hidden lg:block lg:col-span-4 space-y-5">
          {/* Community Info Card */}
          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>About Community</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A secure, shared feed for publishing project updates, insights, and engaging in open discussions with other members.
            </p>

            <div className="pt-2 border-t border-border/60 grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
                <span className="block text-lg font-bold text-foreground">
                  {meta?.total ?? posts.length}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Total Posts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
                <span className="block text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">Status</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateClick}
              className="w-full text-xs font-semibold h-8"
            >
              Start a Discussion
            </Button>
          </div>

          {/* Guidelines / Tips Card */}
          <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Feed Guidelines</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Share helpful updates, questions, or ideas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Keep titles concise and descriptive.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Engage constructively with contributors.</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={() => {
          setPage(1);
          loadPosts();
        }}
      />
    </div>
  );
};

