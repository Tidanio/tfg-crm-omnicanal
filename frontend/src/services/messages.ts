import { api } from './api';

export type MessagePreview = {
  id: number;
  conversationId: number | null;
  contactName?: string | null;
  conversationStatus?: string | null;
  createdAt: string;
  direction: string;
  senderType: string;
  content: string;
  channelType: string | null;
  emailMessageId?: string | null;
  emailInReplyTo?: string | null;
  emailThreadId?: string | null;
};

export async function getLatestMessages(limit = 200): Promise<MessagePreview[]> {
  return api.get<MessagePreview[]>(`/dev/messages/latest?limit=${limit}`);
}

export async function getMessagesByConversation(conversationId: number, limit = 200): Promise<MessagePreview[]> {
  return api.get<MessagePreview[]>(`/dev/messages/by-conversation?conversationId=${conversationId}&limit=${limit}`);
}

export async function sendMessage(conversationId: number, content: string): Promise<MessagePreview> {
  return api.post<MessagePreview>(`/dev/messages/send`, { conversationId, content });
}

export async function resolveConversation(conversationId: number): Promise<void> {
  await api.post<void>(`/dev/messages/conversations/${conversationId}/resolve`, {});
}

export async function reopenConversation(conversationId: number): Promise<void> {
  await api.post<void>(`/dev/messages/conversations/${conversationId}/open`, {});
}
