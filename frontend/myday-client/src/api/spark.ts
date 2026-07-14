import api from './axios';
import type { SparkResponse, StreakResponse, HeatmapEntry } from '../types/spark';

export const sparkApi = {
  getToday: () =>
    api.get<SparkResponse>('/spark/today').then(r => r.data),

  complete: () =>
    api.patch<SparkResponse>('/spark/today/complete').then(r => r.data),

  getStreak: () =>
    api.get<StreakResponse>('/spark/streak').then(r => r.data),

  getHeatmap: () =>
    api.get<HeatmapEntry[]>('/spark/heatmap').then(r => r.data),
};