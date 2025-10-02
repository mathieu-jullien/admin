import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variation?: number;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  variation,
  loading = false,
  children,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  const isPositive = variation !== undefined && variation >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const trendBg = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>

      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {variation !== undefined && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded ${trendBg}`}
          >
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            <span className={`text-sm font-medium ${trendColor}`}>
              {Math.abs(variation)}%
            </span>
          </div>
        )}
      </div>

      {children && (
        <div className="mt-4 pt-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
}
