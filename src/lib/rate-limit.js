const bucket = new Map();

export function checkRateLimit(key, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const record = bucket.get(key);

  if (!record || now > record.resetAt) {
    bucket.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: Math.max(0, record.resetAt - now) };
  }

  record.count += 1;
  bucket.set(key, record);
  return { ok: true, remaining: limit - record.count };
}
