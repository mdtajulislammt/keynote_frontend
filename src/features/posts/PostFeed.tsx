import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { postsApi } from './postsApi';
import { Post } from '@/types/post.types';
import { PaginationMeta } from '@/types/api.types';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { PaginationControl } from '@/components/common/PaginationControl';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { useAppSelector } from '@/redux/hooks';
import { Share2, Plus, FilterX, ShieldCheck, Lock, Cpu, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const PostFeed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterUserId = searchParams.get('userId') || undefined;

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
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
    }
  }, [page, limit, filterUserId]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const clearFilter = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('userId');
    setSearchParams(nextParams);
    setPage(1);
  };

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to publish social posts');
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

  return (
    <div className="space-y-7">
      {/* Project Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 via-background to-card p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Keynote • Secure Note-Taking & Social Post Platform</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
              <span className="text-emerald-600 dark:text-emerald-400">Keynote</span> Social Feed
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
              Explore public architectural updates, engineering discussions, and community posts protected by high-grade role-based access control and index-backed aggregation pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md border border-border">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Role-Based Access Control
            </span>
            <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md border border-border">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              Compound Index Queries
            </span>
            <span className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md border border-border">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Relational $lookup Feeds
            </span>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Recent Announcements
          </h2>
          {filterUserId && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilter}
              className="h-7 text-xs gap-1.5 px-2.5 text-muted-foreground border-emerald-500/40"
            >
              <FilterX className="w-3.5 h-3.5 text-emerald-600" />
              Clear Author Filter
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search feed..."
            className="w-full sm:w-64"
          />

          <Button size="sm" onClick={handleCreateClick} className="gap-2 shrink-0 font-semibold shadow-md shadow-emerald-700/20">
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </Button>
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <Loader text="Loading posts feed..." />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={Share2}
          title={searchTerm ? 'No matching posts found' : 'No posts in feed yet'}
          description={
            searchTerm
              ? `No posts matched "${searchTerm}". Try a different search term.`
              : 'Be the first to publish a technical update or announcement to the feed.'
          }
          actionLabel="Create First Post"
          onAction={handleCreateClick}
        />
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControl
        meta={meta}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        isLoading={isLoading}
      />

      {/* Modal */}
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
