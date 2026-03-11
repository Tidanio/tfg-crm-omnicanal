import { backendAPI as api } from './api';

export async function registerUser(username: string, password: string, email: string) {
  // api.post lanzará un error con el mensaje del backend si falla (ej: "Username already exists")
  await api.post('/auth/register', { username, password, email });
}

export function getUsername(): string | null {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;
  // Basic <base64>
  const token = raw.replace(/^Basic\s+/i, '');
  try {
    const decoded = atob(token);
    const idx = decoded.indexOf(':');
    if (idx >= 0) return decoded.slice(0, idx);
    return decoded;
  } catch (e) {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('auth');
  window.location.reload();
}
