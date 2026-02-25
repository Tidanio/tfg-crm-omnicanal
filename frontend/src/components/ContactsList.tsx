import React, { useEffect, useMemo, useState } from 'react';
import { getContacts, type Contact } from '../services/contacts';
import { Mail, Smartphone, Instagram } from 'lucide-react';
import { getLatestMessages, type MessagePreview } from '../services/messages';

export default function ContactsList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [latest, setLatest] = useState<MessagePreview[]>([]);
  const [query, setQuery] = useState('');
  useEffect(() => {
    getContacts().then(setContacts).catch(() => setContacts([]));
    getLatestMessages(500).then(setLatest).catch(() => setLatest([]));
  }, []);
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = contacts.filter((c) =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.whatsappId || '').toLowerCase().includes(q) ||
      (c.instagramId || '').toLowerCase().includes(q)
    );
    const lastByName = new Map<string, number>();
    latest.forEach((m) => {
      const name = (m.contactName || '').trim();
      if (!name) return;
      const t = new Date(m.createdAt).getTime();
      const prev = lastByName.get(name);
      if (!prev || t > prev) lastByName.set(name, t);
    });
    return filtered.sort((a, b) => {
      const ta = lastByName.get((a.name || '').trim()) || 0;
      const tb = lastByName.get((b.name || '').trim()) || 0;
      return tb - ta;
    });
  }, [contacts, latest, query]);
  return (
    <div className="h-full overflow-y-auto border-r border-gray-200">
      <div className="p-3 space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Contactos</h2>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Buscar contactos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <ul>
        {list.map((c) => (
          <li key={c.id} className="px-3 py-2 hover:bg-gray-50">
            <div className="text-sm font-medium text-gray-800">{c.name}</div>
            <div className="text-xs text-gray-600 flex items-center gap-3 flex-wrap">
              {c.email && (
                <span className="flex items-center gap-1">
                  <Mail size={12} /> {c.email}
                </span>
              )}
              {c.whatsappId && (
                <span className="flex items-center gap-1">
                  <Smartphone size={12} /> {c.whatsappId}
                </span>
              )}
              {c.instagramId && (
                <span className="flex items-center gap-1">
                  <Instagram size={12} /> @{c.instagramId}
                </span>
              )}
              {!c.email && !c.whatsappId && !c.instagramId && (
                <span className="text-gray-400">Sin datos de contacto disponibles</span>
              )}
            </div>
          </li>
        ))}
        {!list.length && (
          <li className="px-3 py-2 text-xs text-gray-500">No hay contactos.</li>
        )}
      </ul>
    </div>
  );
}
