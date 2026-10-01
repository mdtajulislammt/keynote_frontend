import React, { useState } from 'react';
import { Post } from '@/types/post.types';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatTimeAgo } from '@/utils/formatters';
import {
  Calendar,
  Share2,
  Heart,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';

export interface PostCardProps {
  post: Post;
  onFilterAuthor?: (authorId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onFilterAuthor }) => {
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const isAdmin = currentUser?.role === 'admin';
  const author = typeof post.userId === 'object' && post.userId !== null ? post.userId : null;
  const authorId = author?._id || (typeof post.userId === 'string' ? post.userId : '');
  const authorName = author?.name || 'Anonymous Contributor';
  const authorRole = author?.role || 'user';

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => {
    // Generate a natural, deterministic seed like count based on post ID
    const seed = post._id ? post._id.charCodeAt(post._id.length - 1) % 12 : 3;
    return seed + 1;
  });
  const [copied, setCopied] = useState(false);

  // Avatar initials
  const initials = authorName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U';

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posts?userId=${authorId}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success('Post link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.info('Sharing post URL');
    }
  };

  return (
    <article className="group relative rounded-xl border border-border/80 bg-card hover:bg-card/95 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-600/5 transition-all duration-200 overflow-hidden">
      {/* Top Accent Strip on Hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5 sm:p-6 space-y-4">
        {/* Post Author & Meta Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div
              onClick={() => authorId && onFilterAuthor && onFilterAuthor(authorId)}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-sm shadow-sm cursor-pointer hover:ring-2 hover:ring-emerald-500/50 transition-all select-none"
              title={`View posts by ${authorName}`}
            >
              {initials}
              {authorRole === 'admin' && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 rounded-full bg-emerald-600 text-white p-0.5 border border-card shadow-2xs"
                  title="Verified Administrator"
                >
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Author info */}
            <div className="min-w-0 flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => authorId && onFilterAuthor && onFilterAuthor(authorId)}
                  className="font-semibold text-sm text-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate max-w-[200px] text-left"
                >
                  {authorName}
                </button>

                {authorRole === 'admin' ? (
                  <Badge variant="admin" className="text-[10px] py-0 px-1.5 h-4 font-semibold uppercase tracking-wider">
                    Admin
                  </Badge>
                ) : (
                  <span className="text-[11px] text-muted-foreground/80 font-normal">Member</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span title={formatDate(post.createdAt)}>
                  {formatTimeAgo(post.createdAt) || formatDate(post.createdAt)}
                </span>
                {author?.email && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[150px] sm:max-w-[220px] font-mono text-[11px] text-muted-foreground/70">
                      {author.email}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Activity Analytics Link */}
          {isAdmin && authorId && (
            <Link
              to={`/analytics/user-posts?userId=${authorId}`}
              className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-muted/60 transition-colors shrink-0"
              title="View author activity & aggregated metrics"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Content Body */}
        <div className="space-y-2 pt-1">
          <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed">
            {post.body}
          </p>
        </div>

        {/* Post Footer & Engagement Actions */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Like Button */}
            <button
              type="button"
              onClick={handleLike}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                liked
                  ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400 font-semibold'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 ${
                  liked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
              <span>{likeCount}</span>
            </button>

            {/* Quick Discussion Indicator */}
            <button
              type="button"
              onClick={() => {
                toast.info('Community replies coming in the next update!');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Discuss</span>
            </button>

            {/* Share / Copy Link Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Copy link to post"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>

          {/* Time/Date tooltip */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground/70">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

