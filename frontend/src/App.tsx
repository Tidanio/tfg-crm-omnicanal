import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import { getInboxes } from './services/inboxes';
import Toasts from './components/Toasts';
import DocsPage from './components/DocsPage';

export default function App() {
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem('auth'));
  useEffect(() => {
    const th = localStorage.getItem('theme');
    const isDark = th === 'dark';
    const root = document.documentElement;
    if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
    if (authed) {
      getInboxes().catch(() => setAuthed(false));
    }
  }, []);
  const isDocs = typeof window !== 'undefined' && window.location.pathname.startsWith('/docs');
  if (isDocs) return <DocsPage />;
  if (!authed) return (
    <>
      <Toasts />
      <Login onLoggedIn={() => setAuthed(true)} />
    </>
  );
  return (
    <>
      <Toasts />
      <Dashboard />
    </>
  );
}
