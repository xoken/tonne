import { get } from './httpClient';

class AnalyticsAPI {
  getAnalyticsData = async (analyticsJsonQuery: string) => {
    try {
      const { data } = await post('query', analyticsJsonQuery);
      return data;
    } catch (error) {
      throw error;
    }
  };
}

export const analyticsAPI = new AnalyticsAPI();
