import { apiClient } from './client';
import { API_ENDPOINTS } from './config';
import type {
  AnalyticsCounters,
  AnalyticsGraphs,
  AnalyticsRefreshStatus,
  AnalyticsTables,
  AnalyticsTop,
  ExportRequestPayload,
} from '../types/Analytics.type';

const analyticsService = {
  getCounters: async (params: { fromDate: string; toDate: string }): Promise<AnalyticsCounters> => {
    const response = await apiClient.get<{ counterData: AnalyticsCounters }>(
      API_ENDPOINTS.ANALYTICS.COUNTERS,
      params
    );
    return response.counterData;
  },

  getGraphs: async (params: {
    fromDate: string;
    toDate: string;
    top: AnalyticsTop;
  }): Promise<AnalyticsGraphs> => {
    const response = await apiClient.get<{ graphData: AnalyticsGraphs }>(
      API_ENDPOINTS.ANALYTICS.GRAPHS,
      params
    );
    return response.graphData;
  },

  getTables: async (params: {
    fromDate: string;
    toDate: string;
    jobId?: string;
  }): Promise<AnalyticsTables> => {
    const response = await apiClient.get<{ tableData: AnalyticsTables }>(
      API_ENDPOINTS.ANALYTICS.TABLES,
      params
    );
    return response.tableData;
  },

  requestExport: async (payload: ExportRequestPayload): Promise<{ message: string }> => {
    return apiClient.post<{ message: string }>(API_ENDPOINTS.ANALYTICS.EXPORTS, payload);
  },

  triggerRefresh: async (): Promise<{ message: string; refreshId: number; date: string }> => {
    return apiClient.post<{ message: string; refreshId: number; date: string }>(API_ENDPOINTS.ANALYTICS.REFRESH);
  },

  getRefreshStatus: async (): Promise<{ latest: AnalyticsRefreshStatus | null }> => {
    return apiClient.get<{ latest: AnalyticsRefreshStatus | null }>(API_ENDPOINTS.ANALYTICS.REFRESH_STATUS);
  },
};

export { analyticsService };
