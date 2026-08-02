import { useCallback, useState } from 'react';

import type { DataTableStateStorage, PersistedTableState } from './types';
import { localStorageTableStateStorage } from './LocalStorageTableStateStorage';
import { buildTableStorageKey } from './storageKey';

export interface UsePersistedTableStateOptions {
    tableId?: string;
    persist?: boolean;
    storage?: DataTableStateStorage;
}

export interface UsePersistedTableStateResult {
    /** Estado leído una única vez al montar (o `null` si no había nada / está deshabilitado). */
    restored: PersistedTableState | null;
    hasPersistedState: boolean;
    /** Guarda el snapshot completo de la tabla. No-op si `persist` es `false`. */
    persistState: (state: PersistedTableState) => void;
    /** Elimina la entrada de almacenamiento de esta tabla. */
    clear: () => void;
}

/**
 * Hook dedicado que aísla a la DataTable de LocalStorage (o cualquier
 * otra implementación de `DataTableStateStorage`).
 *
 * La DataTable nunca debe importar la implementación de almacenamiento
 * directamente, solo este hook.
 */
export function usePersistedTableState({
    tableId,
    persist = false,
    storage = localStorageTableStateStorage,
}: UsePersistedTableStateOptions): UsePersistedTableStateResult {

    if (persist && !tableId) {
        throw new Error(
            'DataTable: "tableId" es obligatorio cuando "persist" está habilitado.',
        );
    }

    const key = persist && tableId ? buildTableStorageKey(tableId) : null;

    const [restored] = useState<PersistedTableState | null>(
        () => (key ? storage.load(key) : null),
    );

    const [hasPersistedState, setHasPersistedState] = useState(restored !== null);

    const persistState = useCallback((state: PersistedTableState) => {
        if (!key) return;

        storage.save(key, state);
        setHasPersistedState(true);
    }, [key, storage]);

    const clear = useCallback(() => {
        if (!key) return;

        storage.remove(key);
        setHasPersistedState(false);
    }, [key, storage]);

    return {
        restored,
        hasPersistedState,
        persistState,
        clear,
    };
}
