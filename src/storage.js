/**
 * storage.js — Drop-in replacement for Claude's window.storage API.
 *
 * Inside Claude artifacts, window.storage syncs data across all users
 * in real time. Outside Claude (on the real web) we need a real backend
 * to do that. Until you add one, this shim stores everything in
 * localStorage — meaning each device keeps its own copy.
 *
 * ✅ What works:  user login, setup config, budget tracker, challenges
 * ⚠️  Local only:  photo feed posts, meet-up alerts (each device sees its own)
 *
 * To upgrade to real-time sync, swap this file for a Supabase or
 * Firebase client — the rest of the app code stays the same.
 */

const storage = {
  async get(key, shared) {
    try {
      const storageKey = shared ? `shared:${key}` : `local:${key}`;
      const val = localStorage.getItem(storageKey);
      if (val === null) throw new Error('not found');
      return { key, value: val, shared: !!shared };
    } catch {
      throw new Error(`Key not found: ${key}`);
    }
  },

  async set(key, value, shared) {
    try {
      const storageKey = shared ? `shared:${key}` : `local:${key}`;
      localStorage.setItem(storageKey, value);
      return { key, value, shared: !!shared };
    } catch {
      return null;
    }
  },

  async delete(key, shared) {
    try {
      const storageKey = shared ? `shared:${key}` : `local:${key}`;
      localStorage.removeItem(storageKey);
      return { key, deleted: true, shared: !!shared };
    } catch {
      return null;
    }
  },

  async list(prefix, shared) {
    try {
      const p = shared ? `shared:${prefix || ''}` : `local:${prefix || ''}`;
      const keys = Object.keys(localStorage).filter(k => k.startsWith(p));
      return { keys, shared: !!shared };
    } catch {
      return { keys: [] };
    }
  },
};

window.storage = storage;
export default storage;
