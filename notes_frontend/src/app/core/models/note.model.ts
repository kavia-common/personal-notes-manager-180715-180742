import { ID } from '../../shared/types';

/**
 * Note represents a personal note entity.
 */
export interface Note {
  id: ID;
  title: string;
  content: string;
  tags: string[];
  starred: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

/**
 * Minimal UUID generator with crypto fallback.
 */
function generateId(): string {
  // Safe access to global object
  const g = (typeof globalThis !== 'undefined' ? (globalThis as unknown as Record<string, unknown>) : {}) as {
    crypto?: { randomUUID?: () => string; getRandomValues?: (arr: Uint8Array) => void };
  };

  try {
    if (g.crypto?.randomUUID) {
      return g.crypto.randomUUID();
    }
    if (g.crypto?.getRandomValues) {
      const buf = new Uint8Array(16);
      g.crypto.getRandomValues(buf);
      // RFC4122 version 4
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;
      const toHex = (n: number) => n.toString(16).padStart(2, '0');
      const b = Array.from(buf, toHex).join('');
      return `${b.slice(0, 8)}-${b.slice(8, 12)}-${b.slice(12, 16)}-${b.slice(16, 20)}-${b.slice(20)}`;
    }
  } catch {
    // ignore and fallback below
  }
  // Fallback non-crypto
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Create a new Note object with defaults.
 */
export function createNote(partial?: Partial<Note>): Note {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    title: '',
    content: '',
    tags: [],
    starred: false,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}
