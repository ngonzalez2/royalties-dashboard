import { headers } from 'next/headers';

export function assertAdminAccess(request: Request) {
  const headerKey = request.headers.get('x-admin-key');
  const expected = process.env.ADMIN_KEY;

  if (!expected || !headerKey || headerKey !== expected) {
    return false;
  }

  return true;
}

export function readClientAdminKey(): string | null {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem('ADMIN_KEY');
  } catch (error) {
    console.error('[AdminKey]', (error as Error).message);
    return null;
  }
}

export function getServerAdminKey() {
  const h = headers();
  return h.get('x-admin-key');
}
