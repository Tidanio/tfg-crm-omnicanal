import React, { useEffect, useState } from 'react';
import InboxesList from './InboxesList';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { getInboxes, type Inbox } from '../services/inboxes';
import { getLatestMessages, type MessagePreview } from '../services/messages';
import AnalyticsModal from './AnalyticsModal';
import AccountSettingsModal from './AccountSettingsModal';
import ApiSettingsModal from './ApiSettingsModal';
import { logout } from '../services/auth';
import ContactsList from './ContactsList';
import { Smartphone, Instagram, Mail } from 'lucide-react';
import UserQuickPanel from './UserQuickPanel';

export default function Dashboard() {
  const [inboxes, setInboxes] = useState<Inbox[]>([]);
  const [messages, setMessages] = useState<MessagePreview[]>([]);
  const [selectedInboxId, setSelectedInboxId] = useState<number | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [openAnalytics, setOpenAnalytics] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openApiSettings, setOpenApiSettings] = useState(false);
  const [sidebarView, setSidebarView] = useState<'inbox' | 'kanban' | 'conversations_all' | 'conversations_mentions' | 'conversations_unattended' | 'contacts_all'>('conversations_all');
  const [convOpen, setConvOpen] = useState(true);
  const [filterChannel, setFilterChannel] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [inboxesOpen, setInboxesOpen] = useState(false);

  useEffect(() => {
    getInboxes().then(setInboxes).catch(() => setInboxes([]));
    getLatestMessages(500).then(setMessages).catch(() => setMessages([]));
  }, []);

  async function refreshLatest() {
    try {
      const items = await getLatestMessages(500);
      setMessages(items);
    } catch {
      // ignore
    }
  }
  const selectedChannel = filterChannel ?? (selectedInboxId ? (inboxes.find((i) => i.id === selectedInboxId)?.channelType ?? null) : null);

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      <div className="h-12 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <div className="max-w-screen-2xl mx-auto w-full px-6 flex items-center">
          <div className="text-base font-semibold">Dashboard Omnicanal</div>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md text-xs"
              onClick={() => setOpenAnalytics(true)}
            >
              Estadísticas
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400">TFG</div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto w-full px-6 grid lg:grid-cols-12 grid-cols-1 gap-4 h-[calc(100%-48px)]">
        <div className="lg:col-span-3 col-span-1">
          <div className="px-3 space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'inbox' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
              onClick={() => setSidebarView('inbox')}
            >
              Mi bandeja de entrada
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'kanban' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
              onClick={() => setSidebarView('kanban')}
            >
              Kanban
            </button>
            <div>
              <button
                className="w-full text-left px-3 py-2 rounded font-semibold text-sm text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98]"
                onClick={() => setConvOpen((v) => !v)}
              >
                Conversaciones
              </button>
              {convOpen && (
                <>
                  <div className="pl-2 space-y-1">
                    <div className="relative">
                      <button
                      className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'conversations_all' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                      onClick={() => {
                        setSidebarView('conversations_all');
                        setInboxesOpen((v) => !v);
                      }}
                    >
                      Todas las conversaciones
                      </button>
                      {inboxesOpen && sidebarView === 'conversations_all' && (
                        <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-30">
                          <div>
                            <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">Canales</div>
                            <div className="px-3 pb-3 space-y-1">
                              <button
                                className={`w-full text-left px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${selectedChannel === 'EMAIL' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                                onClick={() => {
                                  setSidebarView('conversations_all');
                                  setSelectedInboxId(null);
                                  setFilterChannel((prev) => (prev === 'EMAIL' ? null : 'EMAIL'));
                                }}
                              >
                                Email
                              </button>
                              <button
                                className={`w-full text-left px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${selectedChannel === 'WHATSAPP' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                                onClick={() => {
                                  setSidebarView('conversations_all');
                                  setSelectedInboxId(null);
                                  setFilterChannel((prev) => (prev === 'WHATSAPP' ? null : 'WHATSAPP'));
                                }}
                              >
                                WhatsApp
                              </button>
                              <button
                                className={`w-full text-left px-3 py-2 rounded transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${selectedChannel === 'INSTAGRAM' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                                onClick={() => {
                                  setSidebarView('conversations_all');
                                  setSelectedInboxId(null);
                                  setFilterChannel((prev) => (prev === 'INSTAGRAM' ? null : 'INSTAGRAM'));
                                }}
                              >
                                Instagram
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'conversations_mentions' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                      onClick={() => {
                        setSidebarView('conversations_mentions');
                        setInboxesOpen(false);
                      }}
                    >
                      Menciones
                    </button>
                    <button
                      className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'conversations_unattended' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                      onClick={() => {
                        setSidebarView('conversations_unattended');
                        setInboxesOpen(false);
                      }}
                    >
                      Desatendido
                    </button>
                  </div>
                </>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Contactos</div>
              <div className="pl-2 space-y-1">
                <button
                  className={`w-full text-left px-3 py-2 rounded text-gray-800 dark:text-gray-200 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-[0.98] ${sidebarView === 'contacts_all' ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                  onClick={() => setSidebarView('contacts_all')}
                >
                  Todos los contactos
                </button>
              </div>
            </div>
            <div className="relative mt-3">
              <div className="flex items-center justify-between px-3">
                <div className="text-xs text-gray-600 dark:text-gray-300">Cuenta</div>
                <button
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 active:scale-[0.98]"
                  onClick={() => setAccountOpen((v) => !v)}
                  title="Perfil"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user text-gray-700 dark:text-gray-200"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="10" r="3"></circle><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path></svg>
                </button>
              </div>
              {accountOpen && (
                <UserQuickPanel
                  onClose={() => setAccountOpen(false)}
                  onOpenSettings={() => setOpenSettings(true)}
                  onOpenApiSettings={() => setOpenApiSettings(true)}
                  onLogout={() => {
                    logout();
                    window.location.reload();
                  }}
                  className="absolute left-3 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-40"
                />
              )}
            </div>
          </div>
        </div>
        {sidebarView === 'contacts_all' ? (
          <div className="lg:col-span-4 col-span-1">
            <ContactsList />
          </div>
        ) : (
          <div className="lg:col-span-4 col-span-1">
            <ConversationList
              messages={messages}
              selectedConversationId={selectedConversationId}
              onSelect={setSelectedConversationId}
              filterInboxChannel={selectedChannel}
              viewMode={
                sidebarView === 'conversations_mentions' ? 'mentions' :
                sidebarView === 'inbox' || sidebarView === 'conversations_unattended' ? 'unattended' :
                'all'
              }
            />
          </div>
        )}
        <div className="lg:col-span-5 col-span-1">
          <ChatWindow
            conversationId={selectedConversationId}
            onResolved={() => {
              if (!selectedConversationId) return;
              refreshLatest();
              setSelectedConversationId(null);
            }}
          />
        </div>
      </div>
      <AnalyticsModal open={openAnalytics} onClose={() => setOpenAnalytics(false)} />
      <AccountSettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
      <ApiSettingsModal open={openApiSettings} onClose={() => setOpenApiSettings(false)} />
    </div>
  );
}
