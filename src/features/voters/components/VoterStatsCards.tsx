import { Users, BarChart2, DollarSign } from 'lucide-react';
import { Card } from '@/shared/design-system/components/Card/Card';
import { Skeleton } from '@/shared/design-system/components/Skeleton/Skeleton';
import { cn } from '@/shared/design-system/utils/cn';
import { formatNumber } from '@/features/dashboard/utils/format-utils';
import type { VoterStats } from '../types';

interface VoterStatsCardsProps {
  stats: VoterStats | undefined;
  isLoading: boolean;
}

interface StatCardConfig {
  label: string;
  value: number;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  prefix?: string;
}

export function VoterStatsCards({ stats, isLoading }: VoterStatsCardsProps) {
  const cards: StatCardConfig[] = [
    {
      label: 'Total Voters',
      value: stats?.totalVoters ?? 0,
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-[#0a66c2]',
    },
    {
      label: 'Total Votes',
      value: stats?.totalVotes ?? 0,
      icon: BarChart2,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Spent',
      value: stats?.totalSpent ?? 0,
      icon: DollarSign,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      prefix: 'ETB ',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map(({ label, value, icon: Icon, bgColor, iconColor, prefix }) => (
        <Card key={label} className="p-5">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-full', bgColor)}>
              <Icon className={cn('h-6 w-6', iconColor)} />
            </div>
            <div>
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-3xl font-bold text-gray-900">
                  {prefix}{formatNumber(value)}
                </div>
              )}
              <div className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                {label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
