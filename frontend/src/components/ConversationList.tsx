import React, { useState, useMemo } from 'react';
import type { MessagePreview } from '../services/messages';
import { Mail, MessageCircle, Instagram } from 'lucide-react';

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

const ChannelIcon = ({ type }: { type: string | null }) => {
  switch (type) {
    case 'EMAIL':
      return <Mail size={16} className="text-gray-500" />;
    case 'WHATSAPP':
      return <MessageCircle size={16} className="text-green-500" />;
    case 'INSTAGRAM':
      return <Instagram size={16} className="text-pink-500" />;
    default:
      return <MessageCircle size={16} className="text-gray-400" />;
  }
};

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
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedConversationId === m.conversationId ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
              onClick={() => m.conversationId && onSelect(m.conversationId)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <ChannelIcon type={m.channelType || null} />
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {m.contactName || `Conversa #${m.conversationId}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate pl-6">
                {m.content}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
