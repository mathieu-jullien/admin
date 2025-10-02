export interface AnalyticsStats {
  visitors: number;
  pageViews: number;
  avgDuration: number;
  topPages: TopPage[];
  evolution: EvolutionData[];
}

export interface TopPage {
  path: string;
  views: number;
}

export interface EvolutionData {
  date: string;
  visitors: number;
}
