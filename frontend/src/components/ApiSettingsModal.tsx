import React, { useEffect, useState } from 'react';
import { getWhatsAppConfig, updateWhatsAppConfig } from '../services/config';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ApiSettingsModal({ open, onClose }: Props) {
  const [token, setToken] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      getWhatsAppConfig()
        .then((config) => {
          setToken(config.whatsapp_api_token || '');
          setPhoneId(config.whatsapp_phone_number_id || '');
        })
        .catch(() => setError('Error al cargar la configuración'))
        .finally(() => setLoading(false));
    }
  }, [open]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateWhatsAppConfig({
        whatsapp_api_token: token,
        whatsapp_phone_number_id: phoneId,
      });
      setSuccess('Configuración guardada correctamente');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Configuración de APIs</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded text-sm border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded text-sm border border-green-200 dark:border-green-800">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-2xl">📱</span>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">WhatsApp Business API</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    WhatsApp Access Token
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-xs font-mono resize-none"
                    rows={4}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Pegar aquí el token (EAARdZA7...)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Token de acceso temporal (24h) o permanente obtenido en Meta Developers.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm font-mono"
                    value={phoneId}
                    onChange={(e) => setPhoneId(e.target.value)}
                    placeholder="Ej: 1234567890"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Identificador numérico del teléfono de WhatsApp.
                  </p>
                </div>
              </div>

              {/* Futuras integraciones */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📸</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Instagram</span>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">Próximamente</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📧</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Gmail</span>
                    </div>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">Próximamente</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
