import { api } from './api';

export type Inbox = {
  id: number;
  name: string;
  channelType: string;
};

export async function getInboxes(): Promise<Inbox[]> {
  return api.get<Inbox[]>('/dev/messages/inboxes');
}
