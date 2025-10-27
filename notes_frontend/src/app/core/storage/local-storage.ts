export interface StorageEngine {
  // PUBLIC_INTERFACE
  getItem<T>(key: string, fallback?: T): T | null;

  // PUBLIC_INTERFACE
  setItem<T>(key: string, value: T): void;

  // PUBLIC_INTERFACE
  removeItem(key: string): void;
}

/**
 * LocalStorageEngine wraps browser localStorage and handles JSON serialization.
 * Safe for SSR by checking for globalThis.localStorage.
 */
export class LocalStorageEngine implements StorageEngine {
  // Narrow interface to avoid DOM lib type dependency
  private get store(): { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void } | null {
    try {
      const g = (typeof globalThis !== 'undefined' ? (globalThis as unknown as Record<string, unknown>) : {}) as {
        localStorage?: { getItem: (k: string) => string | null; setItem: (k: string, v: string) => void; removeItem: (k: string) => void };
      };
      return g.localStorage ?? null;
    } catch {
      return null;
    }
  }

  getItem<T>(key: string, fallback?: T): T | null {
    try {
      const s = this.store;
      const raw = s?.getItem(key) ?? null;
      if (raw == null) return fallback ?? null;
      return JSON.parse(raw) as T;
    } catch {
      return fallback ?? null;
    }
  }
  setItem<T>(key: string, value: T): void {
    try {
      const s = this.store;
      s?.setItem(key, JSON.stringify(value));
    } catch {
      // no-op for quota or private mode
    }
  }
  removeItem(key: string): void {
    try {
      const s = this.store;
      s?.removeItem(key);
    } catch {
      // ignore
    }
  }
}
