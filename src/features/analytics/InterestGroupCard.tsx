import React from 'react';
import { Link } from 'react-router-dom';
import { GroupedInterestItem } from '@/types/analytics.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Tag, ArrowRight } from 'lucide-react';

export interface InterestGroupCardProps {
  item: GroupedInterestItem;
}

export const InterestGroupCard: React.FC<InterestGroupCardProps> = ({ item }) => {
  return (
    <Card className="flex flex-col h-full bg-card hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-600/10 hover:-translate-y-1 transition-all duration-300 group">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-200">
              <Tag className="w-4 h-4" />
            </div>
            <CardTitle className="text-base sm:text-lg font-bold leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {item.interest}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1 font-semibold text-xs">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>{item.totalUsers} {item.totalUsers === 1 ? 'member' : 'members'}</span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-4">
        <div className="space-y-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            Community Members:
          </span>

          <div className="divide-y divide-border/50">
            {item.users.map((u) => (
              <div
                key={u._id}
                className="py-2.5 flex items-center justify-between gap-2 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{u.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{u.email}</span>
                </div>

                <Link
                  to={`/posts?userId=${u._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline underline-offset-4 shrink-0 transition-colors"
                  title={`View posts by ${u.name}`}
                >
                  <span>Posts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
