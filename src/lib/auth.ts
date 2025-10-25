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
  localStorage.removeItem('gateway_user_name');
  localStorage.removeItem('gateway_user_email');
  localStorage.removeItem('gateway_user_role');
}

export type Role = 'admin' | 'admin_viewer' | 'user';

export type JwtClaims = {
  sub: string;
  email?: string;
  name?: string;
  role?: Role | string;
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

export function getRole(): Role | null {
  const claims = parseJwt();
  const role = (claims?.role || '').toString().toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'admin_viewer') return 'admin_viewer';
  if (role === 'user') return 'user';
  return null;
}

export function isAdmin(): boolean {
  return getRole() === 'admin';
}

export function isUser(): boolean {
  return getRole() === 'user';
}

export function isAdminRead(): boolean {
  const r = getRole();
  return r === 'admin' || r === 'admin_viewer';
}

export function isAdminFull(): boolean {
  return getRole() === 'admin';
}

// User profile helpers
export function saveUserProfile(user: { id: string; email: string; name?: string | null; role?: string | null }) {
  if (typeof window === 'undefined') return;
  if (user?.name) localStorage.setItem('gateway_user_name', user.name);
  if (user?.email) localStorage.setItem('gateway_user_email', user.email);
  if (user?.role) localStorage.setItem('gateway_user_role', String(user.role).toLowerCase());
}

export function getUserName(): string | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('gateway_user_name');
  if (saved && saved.trim()) return saved.trim();
  const claims = parseJwt();
  return (claims?.name || null);
}

// export function getUserDisplayName(): string {
//   if (typeof window === 'undefined') return 'User';
//   const name = localStorage.getItem('gateway_user_name');
//   if (name && name.trim()) return name.trim();
//   const email = localStorage.getItem('gateway_user_email') || getEmail();
//   if (email) return email;
//   return 'User';
// }

export function getEmail(): string | null {
  const claims = parseJwt();
  return (claims?.email || null);
}

export function getRoleLabel(): string {
  const r = getRole();
  if (r === 'admin') return 'Admin';
  if (r === 'admin_viewer') return 'Admin Viewer';
  if (r === 'user') return 'User';
  return 'Guest';
}

