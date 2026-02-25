import React, { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AccountSettingsModal({ open, onClose }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [autoOffline, setAutoOffline] = useState(false);
  useEffect(() => {
    if (!open) return;
    const dn = localStorage.getItem('displayName') || '';
    const ao = localStorage.getItem('autoOffline') === 'true';
    setDisplayName(dn);
    setAutoOffline(ao);
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg w-[380px] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Ajustes de la cuenta</h3>
          <button className="text-xs text-gray-600" onClick={onClose}>Cerrar</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Nombre visible</label>
            <input
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-600">Marcar como desconectado automáticamente</div>
            <input
              type="checkbox"
              checked={autoOffline}
              onChange={(e) => setAutoOffline(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-xs"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-xs"
              onClick={() => {
                localStorage.setItem('displayName', displayName);
                localStorage.setItem('autoOffline', String(autoOffline));
                onClose();
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
