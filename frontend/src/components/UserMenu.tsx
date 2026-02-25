import React, { useEffect, useRef, useState } from 'react';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { getUsername } from '../services/auth';

type Props = {
  onLogout: () => void;
  onOpenSettings: () => void;
};

export default function UserMenu({ onLogout, onOpenSettings }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  const username = getUsername() || 'usuario';
  return (
    <div className="relative" ref={ref}>
      <button
        className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
        title={username}
      >
        <UserCircle size={20} className="text-gray-700" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow z-40">
          <div className="px-3 py-2 text-xs text-gray-600">{username}</div>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
            onClick={() => {
              setOpen(false);
              onOpenSettings();
            }}
          >
            <Settings size={16} />
            <span>Ajustes de la cuenta</span>
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-red-600"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}
