import React, { useState, useMemo } from 'react';
import type { MessagePreview } from '../services/messages';

type Props = {
  messages: MessagePreview[];
  selectedConversationId?: number | null;
  onSelect: (conversationId: number) => void;
  filterInboxChannel?: string | null;
  viewMode?: 'all' | 'mentions' | 'unattended';
};

function groupLatestByConversation(messages: MessagePreview[]) {
  const map = new Map<number, MessagePreview>();
  messages.forEach((m) => {
    if (m.conversationId == null) return;
    const prev = map.get(m.conversationId);
    if (!prev || new Date(m.createdAt).getTime() > new Date(prev.createdAt).getTime()) {
      map.set(m.conversationId, m);
    }
  });
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export default function ConversationList({ messages, selectedConversationId, onSelect, filterInboxChannel, viewMode = 'all' }: Props) {
  const [query, setQuery] = useState('');
  const [statusView, setStatusView] = useState<'OPEN' | 'RESOLVED'>('OPEN');
  const list = useMemo(() => {
    const grouped = groupLatestByConversation(messages).filter((m) => {
      if (!filterInboxChannel) return true;
      return m.channelType === filterInboxChannel;
    });
    const byView = grouped.filter((m) => {
      if (viewMode === 'mentions') {
        return (m.content || '').includes('@');
      }
      if (viewMode === 'unattended') {
        return (m.direction || '') === 'INCOMING';
      }
      return true;
    });
    const q = query.trim().toLowerCase();
    const byStatus = byView.filter((m) => (m.conversationStatus || 'OPEN') === statusView);
    if (!q) return byStatus;
    return byStatus.filter((m) => (m.contactName || '').toLowerCase().includes(q));
  }, [messages, filterInboxChannel, query, statusView, viewMode]);
  return (
    <div className="h-full overflow-y-auto border-r border-gray-200 dark:border-gray-700">
      <div className="p-3 space-y-2">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Conversaciones</h2>
        <div className="flex gap-2 items-center">
          <label className="text-xs text-gray-600 dark:text-gray-300">Estado:</label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-md px-2 py-1 text-xs"
            value={statusView}
            onChange={(e) => setStatusView(e.target.value as 'OPEN' | 'RESOLVED')}
          >
            <option value="OPEN">Abiertas</option>
            <option value="RESOLVED">Resueltas</option>
          </select>
        </div>
        <input
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar por contacto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul>
        {list.map((m) => (
          <li key={m.conversationId ?? m.id}>
            <button
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${selectedConversationId === m.conversationId ? 'bg-blue-50' : ''}`}
              onClick={() => m.conversationId && onSelect(m.conversationId)}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{m.contactName || `Conversa #${m.conversationId}`}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(m.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-xs text-gray-500 truncate">{m.content}</div>
              {m.emailMessageId && (
                <div className="text-[11px] text-gray-400">MsgID: {m.emailMessageId}</div>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
