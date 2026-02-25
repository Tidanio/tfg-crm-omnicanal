import React, { useEffect, useState } from 'react';
import type { ToastEventDetail } from '../utils/toast';

type Item = { id: number; message: string; type: 'success' | 'error' };

export default function Toasts() {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<ToastEventDetail>).detail;
      const id = Date.now() + Math.random();
      const item = { id, message: detail.message, type: detail.type };
      setItems((prev) => [...prev, item]);
      setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }, 3000);
    }
    window.addEventListener('app:toast', handler as any);
    return () => window.removeEventListener('app:toast', handler as any);
  }, []);
  return (
    <div className="fixed top-3 right-3 space-y-2 z-50">
      {items.map((i) => (
        <div
          key={i.id}
          className={`px-3 py-2 rounded-md shadow text-sm ${i.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
        >
          {i.message}
        </div>
      ))}
    </div>
  );
}
