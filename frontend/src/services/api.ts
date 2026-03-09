const BASE_URL = import.meta.env.VITE_API_URL || '';

function authHeader() {
  const raw = localStorage.getItem('auth');
  if (!raw) return {};
  return { Authorization: raw };
}

export const api = {
  async get<T>(path: string) {
    const res = await fetch(`${BASE_URL}${path}`, { headers: { 'Accept': 'application/json', ...authHeader() } });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json() as Promise<T>;
  },
  async post<T>(path: string, body: unknown) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', ...authHeader() },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
    try {
      return (await res.json()) as T;
    } catch {
      return undefined as T;
    }
  },
};
