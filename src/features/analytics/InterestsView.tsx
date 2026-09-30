import React, { useState, useEffect } from 'react';
import { analyticsApi } from './analyticsApi';
import { GroupedInterestItem } from '@/types/analytics.types';
import { InterestGroupCard } from './InterestGroupCard';
import { SearchBar } from '@/components/common/SearchBar';
import { EmptyState } from '@/components/common/EmptyState';
import { Loader } from '@/components/common/Loader';
import { Button } from '@/components/ui/Button';
import { PieChart, RefreshCw, Layers } from 'lucide-react';
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
      toast.error(err instanceof Error ? err.message : 'Could not fetch interests analytics');
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

  return (
    <div className="space-y-7">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interests Aggregation
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              Scenario 1: $unwind + $group
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time MongoDB aggregation pipeline mapping users grouped by shared technical interests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by topic or user..."
            className="w-full sm:w-64"
          />

          <Button variant="outline" size="sm" onClick={loadData} isLoading={isLoading} className="gap-1.5 font-semibold">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Aggregation Pipeline Overview Card */}
      <div className="bg-emerald-500/5 border border-emerald-500/30 p-5 rounded-xl space-y-2.5">
        <div className="flex items-center gap-2 font-bold text-sm text-foreground">
          <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>MongoDB Aggregation Architecture</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Executed with a single strictly optimized aggregation pipeline:{' '}
          <code className="font-mono bg-white dark:bg-black/60 px-2 py-1 rounded-md text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            $unwind: &quot;$interests&quot; → $group: &#123; _id: &quot;$interests&quot;, totalUsers: &#123; $sum: 1 &#125;, users: &#123; $push: ... &#125; &#125; → $sort: &#123; totalUsers: -1 &#125;
          </code>
        </p>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <Loader text="Executing MongoDB aggregation pipeline..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PieChart}
          title={searchTerm ? 'No matching interest groups' : 'No interest data available'}
          description={
            searchTerm
              ? `No interest groups match "${searchTerm}".`
              : 'Add interests to user profiles during registration to populate this aggregation view.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <InterestGroupCard key={item.interest} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};
