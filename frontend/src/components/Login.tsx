import React, { useState } from 'react';
import { getInboxes } from '../services/inboxes';

type Props = {
  onLoggedIn: () => void;
};

export default function Login({ onLoggedIn }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError('');
    setLoading(true);
    const token = 'Basic ' + btoa(`${username}:${password}`);
    localStorage.setItem('auth', token);
    try {
      await getInboxes();
      onLoggedIn();
    } catch (e) {
      setError('Credenciales inválidas');
      localStorage.removeItem('auth');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-lg p-6 w-[360px]">
        <h1 className="text-lg font-semibold mb-4">Login</h1>
        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-60"
            onClick={submit}
            disabled={loading || !username || !password}
          >
            {loading ? 'Accediendo...' : 'Acceder'}
          </button>
        </div>
      </div>
    </div>
  );
}
