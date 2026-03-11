import React, { useEffect, useState } from 'react';
import { Settings, Sun, Moon, Keyboard, FileText, Clock, LogOut, Radio } from 'lucide-react';

type Props = {
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenApiSettings: () => void;
  onLogout: () => void;
  className?: string;
};

export default function UserQuickPanel({ onClose, onOpenSettings, onOpenApiSettings, onLogout, className }: Props) {
  const [availability, setAvailability] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
  const [autoOffline, setAutoOffline] = useState<boolean>(localStorage.getItem('autoOffline') === 'true');
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage.getItem('theme') === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    const savedAvail = (localStorage.getItem('availability') as 'ONLINE' | 'OFFLINE') || 'OFFLINE';
    setAvailability(savedAvail);
  }, []);

  function applyTheme(next: 'light' | 'dark') {
    setTheme(next);
    localStorage.setItem('theme', next);
    const root = document.documentElement;
    if (next === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
  }

  return (
    <div className={className ?? "absolute left-3 bottom-14 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-40"}>
      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">Cuenta</div>
      <div className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-700 dark:text-gray-200">Disponibilidad</label>
          <select
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded px-2 py-1 text-xs"
            value={availability}
            onChange={(e) => {
              const val = e.target.value as 'ONLINE' | 'OFFLINE';
              setAvailability(val);
              localStorage.setItem('availability', val);
            }}
          >
            <option value="ONLINE">Conectado</option>
            <option value="OFFLINE">Desconectado</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700 dark:text-gray-200">Desconectar automáticamente</span>
          <input
            type="checkbox"
            checked={autoOffline}
            onChange={(e) => {
              setAutoOffline(e.target.checked);
              localStorage.setItem('autoOffline', String(e.target.checked));
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-700 dark:text-gray-200">Apariencia</span>
          <div className="flex items-center gap-1">
            <button
              className={`px-2 py-1 rounded text-xs ${theme === 'light' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              onClick={() => applyTheme('light')}
              title="Claro"
            >
              <Sun size={14} />
            </button>
            <button
              className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              onClick={() => applyTheme('dark')}
              title="Oscuro"
            >
              <Moon size={14} />
            </button>
          </div>
        </div>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
        >
          <Settings size={16} />
          <span>Ajustes de la cuenta</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
          onClick={() => {
            onClose();
            onOpenApiSettings();
          }}
        >
          <Radio size={16} />
          <span>Configurar APIs</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
          <Keyboard size={16} />
          <span>Atajos de teclado</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200"
          onClick={() => window.open('/docs', '_blank')}
        >
          <FileText size={16} />
          <span>Documentación</span>
        </button>
        <button className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
          <Clock size={16} />
          <span>Notas de versión</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-red-600"
          onClick={() => {
            onClose();
            onLogout();
          }}
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
