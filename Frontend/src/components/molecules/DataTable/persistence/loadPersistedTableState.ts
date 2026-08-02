import type { DataTableStateStorage, PersistedTableState } from './types';
import { localStorageTableStateStorage } from './LocalStorageTableStateStorage';
import { buildTableStorageKey } from './storageKey';

/**
 * Lectura puntual (fuera de React) del estado persistido de una tabla.
 *
 * Pensada para sembrar, de forma síncrona, el estado inicial que
 * dispara el primer request (ej. `useState(() => loadPersistedTableState(...))`
 * en la vista consumidora), de modo que la restauración ocurra
 * **antes** de ese primer request.
 */
export function loadPersistedTableState(
    tableId: string,
    storage: DataTableStateStorage = localStorageTableStateStorage,
): PersistedTableState | null {
    return storage.load(buildTableStorageKey(tableId));
}
