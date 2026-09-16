import { config } from '../config/env.js';

export function listKey(collection, params = {}) {
  const suffix = Object.entries(params)
    .filter(([, value]) => value)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(':');
  return suffix ? `taskflow:${collection}:${suffix}` : `taskflow:${collection}`;
}

export async function getFromCache(client, key) {
  try {
    const raw = await client.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setInCache(client, key, value, ttl = config.cacheTtl) {
  try {
    await client.set(key, JSON.stringify(value), { EX: ttl });
    return true;
  } catch {
    return false;
  }
}

export async function deleteFromCache(client, key) {
  try {
    await client.del(key);
  } catch {
    /* noop */
  }
}

export async function pushToQueue(client, requestId) {
  try {
    await client.rPush(config.queueName, requestId);
    return true;
  } catch (err) {
    console.error('[Redis] Error al encolar:', err.message);
    return false;
  }
}

export async function getQueueLength(client) {
  try {
    return await client.lLen(config.queueName);
  } catch {
    return 0;
  }
}