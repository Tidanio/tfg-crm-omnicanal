import React, { useState, useRef, useEffect } from 'react';
import type { Inbox } from '../services/inboxes';
import { Smartphone, Instagram, Mail, UserCircle } from 'lucide-react';
import UserQuickPanel from './UserQuickPanel';

type Props = {
  inboxes: Inbox[];
  selectedInboxId?: number | null;
  onSelect: (id: number | null) => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  mode?: 'full' | 'account_only';
};

export default function InboxesList({ inboxes, selectedInboxId, onSelect, onLogout, onOpenSettings, mode = 'full' }: Props) {
  const [openPanel, setOpenPanel] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpenPanel(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  return (
    <div className="h-full border-r border-gray-200 dark:border-gray-700 flex flex-col relative" ref={containerRef}>
      {mode === 'full' && (
        <>
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Inboxes</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="text-xs text-blue-600 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded px-2 py-1 active:scale-[0.98]"
                onClick={() => onSelect(null)}
              >
                Todos
              </button>
            </div>
          </div>
          <ul className="overflow-y-auto">
            {inboxes.map((i) => (
              <li key={i.id}>
                <button
                  className={`w-full text-left px-3 py-2 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${selectedInboxId === i.id ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                  onClick={() => onSelect(i.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      {i.channelType === 'WHATSAPP' && <Smartphone size={16} />}
                      {i.channelType === 'INSTAGRAM' && <Instagram size={16} />}
                      {i.channelType === 'EMAIL' && <Mail size={16} />}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{i.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{i.channelType}</div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="mt-auto p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">Cuenta</div>
          <button
            className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
            onClick={() => setOpenPanel((v) => !v)}
            title="Perfil"
          >
            <UserCircle size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
      {openPanel && (
        <UserQuickPanel
          onClose={() => setOpenPanel(false)}
          onOpenSettings={onOpenSettings ?? (() => {})}
          onLogout={onLogout ?? (() => {})}
        />
      )}
    </div>
  );
}
