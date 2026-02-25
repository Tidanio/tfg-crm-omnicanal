import React, { useEffect, useState } from 'react';
import type { MessagePreview } from '../services/messages';
import { getMessagesByConversation, sendMessage, resolveConversation, reopenConversation } from '../services/messages';
import { toastSuccess, toastError } from '../utils/toast';

type Props = {
  conversationId?: number | null;
  onResolved?: () => void;
};

export default function ChatWindow({ conversationId, onResolved }: Props) {
  const [messages, setMessages] = useState<MessagePreview[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const status = messages.length ? (messages[messages.length - 1].conversationStatus || 'OPEN') : 'OPEN';
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    getMessagesByConversation(conversationId, 500).then(setMessages).catch(() => setMessages([]));
  }, [conversationId]);

  async function onSend() {
    if (!conversationId || !text.trim()) return;
    setSending(true);
    try {
      const sent = await sendMessage(conversationId, text.trim());
      setMessages((prev) => [...prev, sent]);
      setText('');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Chat</h2>
          <div className="text-xs text-gray-500 dark:text-gray-400">Conversación #{conversationId ?? '-'}</div>
        </div>
        <div className="ml-auto">
          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md text-xs disabled:opacity-60"
            disabled={!conversationId}
            onClick={async () => {
              if (!conversationId) return;
              try {
                if (status === 'RESOLVED') {
                  await reopenConversation(conversationId);
                  toastSuccess('Conversación reabierta');
                } else {
                  await resolveConversation(conversationId);
                  toastSuccess('Conversación resuelta');
                }
                onResolved && onResolved();
              } catch {
                toastError(status === 'RESOLVED' ? 'Error al reabrir la conversación' : 'Error al resolver la conversación');
              }
            }}
          >
            {status === 'RESOLVED' ? 'Reabrir' : 'Resolver'}
          </button>
        </div>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto flex-1">
        {messages.map((m) => (
          <div key={m.id} className={`max-w-[70%] ${m.direction === 'OUTGOING' ? 'ml-auto' : ''}`}>
            <div className={`rounded-2xl px-3 py-2 shadow-sm ${m.direction === 'OUTGOING' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'}`}>
              <div className="text-[11px] opacity-75 mb-1">
                {new Date(m.createdAt).toLocaleString()} • {m.channelType ?? ''}
              </div>
              <div className="text-sm leading-relaxed">{m.content}</div>
            </div>
          </div>
        ))}
        {!messages.length && (
          <div className="text-xs text-gray-500 dark:text-gray-400">Selecciona una conversación para ver sus mensajes.</div>
        )}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex gap-2">
          <textarea
            className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe un mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={2}
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-60"
            onClick={onSend}
            disabled={sending || !text.trim() || !conversationId}
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
