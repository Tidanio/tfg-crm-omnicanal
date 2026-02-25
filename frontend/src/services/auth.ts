export function getUsername(): string | null {
  const raw = localStorage.getItem('auth');
  if (!raw) return null;
  const token = raw.replace(/^Basic\s+/i, '');
  try {
    const decoded = atob(token);
    const idx = decoded.indexOf(':');
    return idx >= 0 ? decoded.slice(0, idx) : decoded;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem('auth');
}
