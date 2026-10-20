/**
 * Safe Storage Utility for iOS Safari, WKWebView, Private Browsing and In-App Browsers
 * 
 * In iOS Safari Private Browsing, in-app browsers (WhatsApp, Instagram, TikTok),
 * and restricted iframe contexts, accessing `window.localStorage` directly throws
 * `SecurityError: The operation is insecure` or `QuotaExceededError`.
 * 
 * This utility wraps all localStorage operations with try-catch and transparently
 * falls back to an in-memory store so that the application NEVER crashes on iOS.
 */

class SafeStorage {
  private memoryStore: Map<string, string> = new Map();
  private isStorageAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__safe_storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public getItem(key: string): string | null {
    if (this.isStorageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fall back to memory
      }
    }
    return this.memoryStore.has(key) ? this.memoryStore.get(key)! : null;
  }

  public setItem(key: string, value: string): void {
    // Always keep memory store updated as immediate backup
    this.memoryStore.set(key, value);

    if (this.isStorageAvailable) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Gracefully ignore quota or security exceptions on iOS
      }
    }
  }

  public removeItem(key: string): void {
    this.memoryStore.delete(key);

    if (this.isStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore
      }
    }
  }

  public clear(): void {
    this.memoryStore.clear();

    if (this.isStorageAvailable) {
      try {
        window.localStorage.clear();
      } catch {
        // Ignore
      }
    }
  }
}

export const safeStorage = new SafeStorage();
