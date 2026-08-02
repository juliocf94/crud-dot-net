import type { DataTableStateStorage, PersistedTableState } from './types';
import { PERSISTED_TABLE_STATE_VERSION } from './types';

/**
 * Implementación inicial del contrato `DataTableStateStorage`
 * usando el LocalStorage del navegador.
 */
export class LocalStorageTableStateStorage implements DataTableStateStorage {
    load(key: string): PersistedTableState | null {
        if (typeof window === 'undefined') return null;

        try {
            const raw = window.localStorage.getItem(key);

            if (!raw) return null;

            const parsed = JSON.parse(raw) as PersistedTableState;

            if (parsed?.version !== PERSISTED_TABLE_STATE_VERSION) {
                this.remove(key);
                return null;
            }

            return parsed;
        } catch {
            return null;
        }
    }

    save(key: string, state: PersistedTableState): void {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.setItem(
                key,
                JSON.stringify({
                    ...state,
                    version: PERSISTED_TABLE_STATE_VERSION,
                }),
            );
        } catch {
            // LocalStorage lleno o deshabilitado (ej. modo privado): se ignora.
        }
    }

    remove(key: string): void {
        if (typeof window === 'undefined') return;

        try {
            window.localStorage.removeItem(key);
        } catch {
            // Ignorar.
        }
    }
}

export const localStorageTableStateStorage = new LocalStorageTableStateStorage();
