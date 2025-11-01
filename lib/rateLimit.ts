const WINDOW_MS = 2000;

interface HitRecord {
  timestamp: number;
  count: number;
}

const store = new Map<string, HitRecord>();

export function allowRequest(key: string) {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, { timestamp: now, count: 1 });
    return true;
  }

  if (now - record.timestamp > WINDOW_MS) {
    store.set(key, { timestamp: now, count: 1 });
    return true;
  }

  if (record.count < 1) {
    record.count += 1;
    return true;
  }

  return false;
}

export function noteRateLimitReset(key: string) {
  store.delete(key);
}

export function getClientKey(request: Request) {
  const headerIp = request.headers.get('x-forwarded-for');
  return headerIp?.split(',')[0]?.trim() || 'unknown';
}
