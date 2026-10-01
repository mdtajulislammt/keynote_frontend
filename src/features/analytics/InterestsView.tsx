import React, { useState, useEffect } from 'react';
import { analyticsApi } from './analyticsApi';
import { GroupedInterestItem } from '@/types/analytics.types';
import { InterestGroupCard } from './InterestGroupCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { Compass, RefreshCw, Sparkles, Users } from 'lucide-react';
import { toast } from 'sonner';

export const InterestsView: React.FC = () => {
  const [data, setData] = useState<GroupedInterestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await analyticsApi.getUsersByInterests();
      setData(res.data);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not fetch topics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = data.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const interestMatch = item.interest.toLowerCase().includes(term);
    const userMatch = item.users.some(
      (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    return interestMatch || userMatch;
  });

  const totalMembers = data.reduce((acc, curr) => acc + curr.totalUsers, 0);

  return (
    <div className="space-y-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Community Topics
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Discover
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Explore topics and connect with community members who share your passions and skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search topic or member..."
            className="w-full sm:w-64"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            isLoading={isLoading}
            className="gap-1.5 font-semibold shrink-0"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Friendly Overview Banner */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 font-bold text-sm text-foreground">
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Connect by Shared Passions</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Browse through community topics below to see what members are interested in. Click on any member to read their posts and see their contributions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end">
          <div className="px-3.5 py-2 rounded-lg bg-card border border-border/80 text-center">
            <span className="block text-base font-bold text-foreground">{data.length}</span>
            <span className="text-[11px] text-muted-foreground font-medium">Topics</span>
          </div>
          <div className="px-3.5 py-2 rounded-lg bg-card border border-border/80 text-center">
            <span className="block text-base font-bold text-emerald-600 dark:text-emerald-400">
              {totalMembers}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">Connections</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <Loader text="Loading community topics..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchTerm ? 'No matching topics found' : 'No topics available yet'}
          description={
            searchTerm
              ? `No topics or members match "${searchTerm}". Try a different keyword.`
              : 'Add your favorite topics and interests in your profile to connect with others.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <InterestGroupCard key={item.interest} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

