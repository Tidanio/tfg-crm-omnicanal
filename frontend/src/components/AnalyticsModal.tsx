import React, { useEffect, useMemo, useState } from 'react';
import { getStats, type StatsResponse } from '../services/stats';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AnalyticsModal({ open, onClose }: Props) {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!open) return;
    setError('');
    getStats().then(setStats).catch(() => setError('No se pudieron cargar las estadísticas'));
  }, [open]);
  if (!open) return null;
  const totalByChannel = useMemo(() => {
    if (!stats) return 0;
    return Object.values(stats.byChannel || {}).reduce((a, b) => a + b, 0);
  }, [stats]);
  const totalByStatus = useMemo(() => {
    if (!stats) return 0;
    return Object.values(stats.byStatus || {}).reduce((a, b) => a + b, 0);
  }, [stats]);
  function pct(value: number, total: number) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-lg w-[380px] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">Estadísticas</h3>
          <button className="text-xs text-gray-600" onClick={onClose}>Cerrar</button>
        </div>
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
        {!stats && !error && <div className="text-sm text-gray-500">Cargando...</div>}
        {stats && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Por canal</div>
              <div className="space-y-2">
                {Object.entries(stats.byChannel).map(([channel, count]) => (
                  <div key={channel}>
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span>{channel}</span>
                      <span>{count} ({pct(count, totalByChannel)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-blue-500 rounded" style={{ width: `${pct(count, totalByChannel)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Por estado</div>
              <div className="space-y-2">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between text-xs text-gray-700">
                      <span>{status}</span>
                      <span>{count} ({pct(count, totalByStatus)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded">
                      <div className={`h-2 ${status === 'OPEN' ? 'bg-green-500' : 'bg-gray-500'} rounded`} style={{ width: `${pct(count, totalByStatus)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-700 mb-1">Canal por estado</div>
              <div className="space-y-2">
                {Object.entries(stats.byChannelStatus).map(([channel, statusCounts]) => (
                  <div key={channel} className="text-xs text-gray-700">
                    <div className="font-semibold">{channel}</div>
                    <div className="flex items-center gap-2">
                      {Object.entries(statusCounts).map(([status, count]) => (
                        <div key={status} className="flex items-center gap-1">
                          <span>{status}:</span>
                          <span className="font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
