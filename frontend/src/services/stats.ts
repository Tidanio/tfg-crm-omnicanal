import { api } from './api';

export type StatsResponse = {
  byChannel: Record<string, number>;
  byStatus: Record<string, number>;
  byChannelStatus: Record<string, Record<string, number>>;
};

export async function getStats(): Promise<StatsResponse> {
  return api.get<StatsResponse>('/dev/stats');
}
