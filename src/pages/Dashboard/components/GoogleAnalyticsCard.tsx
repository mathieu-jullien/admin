import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, Clock } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { analyticsService } from '../../../services/analytics';
import type { AnalyticsStats } from '../../../types/pages/analytics';
import { ApiException } from '../../../types/api/errors';

export default function GoogleAnalyticsCard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const controller = new AbortController();

      try {
        setLoading(true);
        setError(null);

        const data = await analyticsService.getStats('7d', controller.signal);
        setStats(data);
      } catch (err) {
        if (err instanceof ApiException) {
          setError(err.message);
        } else {
          setError('Erreur lors du chargement des analytics');
        }
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }

      return () => controller.abort();
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">
          Google Analytics (7 derniers jours)
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Visiteurs</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">{stats.visitors}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Pages vues
            </span>
          </div>
          <p className="text-2xl font-bold text-green-900">{stats.pageViews}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              Durée moyenne
            </span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {formatDuration(stats.avgDuration)}
          </p>
        </div>
      </div>

      {stats.evolution.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Évolution des visiteurs
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={date =>
                  format(new Date(date), 'dd MMM', { locale: fr })
                }
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip
                labelFormatter={date =>
                  format(new Date(date), 'dd MMMM yyyy', { locale: fr })
                }
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.topPages.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Pages les plus visitées
          </h4>
          <div className="space-y-2">
            {stats.topPages.slice(0, 5).map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700 truncate">
                    {page.path}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {page.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
