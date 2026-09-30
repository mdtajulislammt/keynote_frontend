import React from 'react';
import { Post } from '@/types/post.types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatters';
import { Calendar, User as UserIcon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const author = typeof post.userId === 'object' && post.userId !== null ? post.userId : null;
  const authorId = author?._id || (typeof post.userId === 'string' ? post.userId : '');
  const authorName = author?.name || 'Anonymous Contributor';
  const authorRole = author?.role || 'user';

  return (
    <Card className="bg-card hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-0.5 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl font-bold leading-snug text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={authorRole === 'admin' ? 'admin' : 'secondary'}>
              {authorRole}
            </Badge>
          </div>
        </div>

        {author && (
          <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-2xs">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-foreground">{authorName}</span>
                {author.email && (
                  <span className="text-muted-foreground hidden sm:inline font-normal">({author.email})</span>
                )}
              </div>
            </div>

            {authorId && (
              <Link
                to={`/analytics/user-posts?userId=${authorId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 shrink-0 transition-colors"
                title="Inspect user posts ($lookup aggregation)"
              >
                <span>View Activity</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="py-2">
        <p className="text-sm sm:text-base text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans">
          {post.body}
        </p>
      </CardContent>

      <CardFooter className="pt-3 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Published {formatDate(post.createdAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};
