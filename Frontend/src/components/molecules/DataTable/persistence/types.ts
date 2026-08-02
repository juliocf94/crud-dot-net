import type {
    ColumnOrderState,
    ColumnSizingState,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';

export const PERSISTED_TABLE_STATE_VERSION = 1;

export interface PersistedTableState {
    version: number;

    pagination: {
        page: number;
        pageSize: number;
    };

    sorting: SortingState;
    filters: Record<string, unknown>;
    columnVisibility: VisibilityState;
    columnOrder: ColumnOrderState;
    columnSizing: ColumnSizingState;

    /** Opcional: ver spec (persistencia de selección de filas). */
    rowSelection: RowSelectionState;
}

/**
 * Contrato desacoplado de almacenamiento.
 * La DataTable depende de este contrato, nunca de una
 * implementación concreta (LocalStorage, IndexedDB, API, ...).
 */
export interface DataTableStateStorage {
    load(key: string): PersistedTableState | null;
    save(key: string, state: PersistedTableState): void;
    remove(key: string): void;
}
