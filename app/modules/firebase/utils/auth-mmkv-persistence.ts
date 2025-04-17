import { Persistence } from "@firebase/auth";

import storage from "@/utils/storage";

// interfaces
// -----------------------------------------------------------------------------------
export const enum PersistenceType {
  SESSION = "SESSION",
  LOCAL = "LOCAL",
  NONE = "NONE",
}

export type PersistedBlob = Record<string, unknown>;

export interface Instantiator<T> {
  (blob: PersistedBlob): T;
}

export type PersistenceValue = PersistedBlob | string;

export const STORAGE_AVAILABLE_KEY = "__sak";

export interface StorageEventListener {
  (value: PersistenceValue | null): void;
}

export interface PersistenceInternal extends Persistence {
  type: PersistenceType;
  _isAvailable(): Promise<boolean>;
  _set(key: string, value: PersistenceValue): void;
  _get<T extends PersistenceValue>(key: string): Promise<T | null>;
  _remove(key: string): void;
  _addListener(key: string, listener: StorageEventListener): void;
  _removeListener(key: string, listener: StorageEventListener): void;
  _shouldAllowMigration?: boolean;
}

// implementation
// -----------------------------------------------------------------------------------
export function getMmkvPersistence(): Persistence {
  return class implements PersistenceInternal {
    static type: "LOCAL" = "LOCAL";
    readonly type: PersistenceType = PersistenceType.LOCAL;

    async _isAvailable() {
      try {
        if (!storage) {
          return false;
        }
        storage.set(STORAGE_AVAILABLE_KEY, "1");
        storage.delete(STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: PersistenceValue) {
      return storage.set(key, JSON.stringify(value));
    }

    async _get<T extends PersistenceValue>(key: string): Promise<T | null> {
      const json = storage.getString(key);
      return json ? JSON.parse(json) : null;
    }

    _remove(key: string) {
      return Promise.resolve(storage.delete(key));
    }

    _addListener(_key: string, _listener: StorageEventListener) {
      // Listeners are not supported for React Native storage.
      return;
    }

    _removeListener(_key: string, _listener: StorageEventListener) {
      // Listeners are not supported for React Native storage.
      return;
    }
  };
}
