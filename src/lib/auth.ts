export function saveToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gateway_jwt', token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gateway_jwt');
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gateway_jwt');
}

export type JwtClaims = {
  sub: string;
  email?: string;
  role?: 'user' | 'admin' | string;
  [k: string]: any;
};

function safeDecodeBase64Url(input: string): string | null {
  try {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=');
    if (typeof window === 'undefined') return Buffer.from(padded, 'base64').toString('utf8');
    // atob handles standard base64 in browser
    return typeof atob === 'function' ? atob(padded) : null;
  } catch {
    return null;
  }
}

export function parseJwt(token?: string | null): JwtClaims | null {
  const t = token ?? getToken();
  if (!t) return null;
  const parts = t.split('.');
  if (parts.length !== 3) return null;
  const json = safeDecodeBase64Url(parts[1]);
  if (!json) return null;
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRole(): 'admin' | 'user' | null {
  const claims = parseJwt();
  const role = (claims?.role || '').toString().toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'user') return 'user';
  return null;
}

export function isAdmin(): boolean {
  return getRole() === 'admin';
}

export function isUser(): boolean {
  return getRole() === 'user';
}


