import { apiClient } from '../api/client';
import { endpoints } from '../api/endpoints';
import type { AnalyticsStats } from '../../types/pages/analytics';

export const analyticsService = {
  /**
   * Récupère les statistiques Google Analytics
   * @param period - Période d'analyse (ex: '7d', '30d', 'month')
   */
  getStats: async (
    period: string = '7d',
    signal?: AbortSignal
  ): Promise<AnalyticsStats> => {
    return apiClient.get<AnalyticsStats>(
      endpoints.analytics.stats(period),
      signal
    );
  },
};
