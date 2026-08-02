import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    useReactTable,
    getCoreRowModel,
    type ColumnOrderState,
    type ColumnSizingState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    type PaginationState,
    type ColumnDef,
} from '@tanstack/react-table';

import type {
    PaginationMetadata, PaginationRequest
} from '@typings/pagination';

import { toTablePagination, toServerPagination } from '../utils/pagination-adapter';
import { usePersistedTableState } from '../persistence';
import type { PersistedTableState } from '../persistence';
import { PERSISTED_TABLE_STATE_VERSION } from '../persistence';

interface DataTableContextValue<TData> {
    table: ReturnType<typeof useReactTable<TData>>;
    loading: boolean;
    hasPersistedState: boolean;
    resetPersistedState: () => void;
}

const DataTableContext = createContext<DataTableContextValue<any> | null>(null);

export function useDataTableContext<TData>() {
    const context = useContext(DataTableContext);

    if (!context) {
        throw new Error('useDataTableContext must be used within DataTableProvider');
    }

    return context as DataTableContextValue<TData>;
}

interface DataTableProviderProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading: boolean;

    pagination: PaginationMetadata;
    onPaginationChange: (pagination: PaginationRequest) => void;

    tableId?: string;
    persist?: boolean;
    initialSorting?: SortingState;
    initialColumnVisibility?: VisibilityState;
    initialColumnOrder?: ColumnOrderState;
    initialColumnSizing?: ColumnSizingState;
    initialRowSelection?: RowSelectionState;

    children: React.ReactNode;
}

export function DataTableProvider<TData>({
    data,
    columns,
    pagination,
    loading,
    onPaginationChange,

    tableId,
    persist = false,
    initialSorting,
    initialColumnVisibility,
    initialColumnOrder,
    initialColumnSizing,
    initialRowSelection,

    children,
}: DataTableProviderProps<TData>) {

    // Prioridad: LocalStorage -> props iniciales -> valores por defecto.
    const { restored, hasPersistedState, persistState, clear } = usePersistedTableState({
        tableId,
        persist,
    });

    const [sorting, setSorting] = useState<SortingState>(
        restored?.sorting ?? initialSorting ?? [],
    );
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        restored?.columnVisibility ?? initialColumnVisibility ?? {},
    );
    const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
        restored?.columnOrder ?? initialColumnOrder ?? [],
    );
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
        restored?.columnSizing ?? initialColumnSizing ?? {},
    );
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(
        restored?.rowSelection ?? initialRowSelection ?? {},
    );

    const tablePagination = useMemo<PaginationState>(() => {
        return toTablePagination(pagination);
    }, [pagination]);

    // Corrección de respaldo: si la vista consumidora no sembró su propio
    // estado inicial de paginación desde el almacenamiento, la corregimos
    // aquí. El camino recomendado (y el único que evita un doble request)
    // es que la vista use `loadPersistedTableState`/`usePersistedTableState`
    // para sembrar su estado ANTES de construir la DataTable.
    const didCheckRestoredPagination = useRef(false);
    useEffect(() => {
        if (didCheckRestoredPagination.current) return;

        didCheckRestoredPagination.current = true;

        if (!restored?.pagination) return;

        const samePage = restored.pagination.page === pagination.page;
        const sameSize = restored.pagination.pageSize === pagination.pageSize;

        if (!samePage || !sameSize) {
            onPaginationChange(restored.pagination);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const table = useReactTable({
        data,
        columns,

        state: {
            pagination: tablePagination,
            sorting,
            columnVisibility,
            columnOrder,
            columnSizing,
            rowSelection,
        },

        pageCount: pagination.totalPages,

        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,

        onPaginationChange: (updater) => {
            const next =
                typeof updater === 'function'
                    ? updater(table.getState().pagination)
                    : updater;

            onPaginationChange(
                toServerPagination(next)
            );
        },

        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnOrderChange: setColumnOrder,
        onColumnSizingChange: setColumnSizing,
        onRowSelectionChange: setRowSelection,

        getCoreRowModel: getCoreRowModel(),
    });

    // Sincronización: persistir automáticamente el estado completo de la
    // tabla ante cualquier cambio. Sin botón de guardar.
    useEffect(() => {
        if (!persist) return;

        const snapshot: PersistedTableState = {
            version: PERSISTED_TABLE_STATE_VERSION,
            pagination: {
                page: pagination.page,
                pageSize: pagination.pageSize,
            },
            sorting,
            filters: {},
            columnVisibility,
            columnOrder,
            columnSizing,
            rowSelection,
        };

        persistState(snapshot);
    }, [
        persist,
        persistState,
        pagination.page,
        pagination.pageSize,
        sorting,
        columnVisibility,
        columnOrder,
        columnSizing,
        rowSelection,
    ]);

    const resetPersistedState = useCallback(() => {
        clear();

        setSorting(initialSorting ?? []);
        setColumnVisibility(initialColumnVisibility ?? {});
        setColumnOrder(initialColumnOrder ?? []);
        setColumnSizing(initialColumnSizing ?? {});
        setRowSelection(initialRowSelection ?? {});

        onPaginationChange({ page: 1, pageSize: pagination.pageSize });
    }, [
        clear,
        initialSorting,
        initialColumnVisibility,
        initialColumnOrder,
        initialColumnSizing,
        initialRowSelection,
        onPaginationChange,
        pagination.pageSize,
    ]);

    const value = useMemo(() => ({
        table,
        loading,
        hasPersistedState,
        resetPersistedState,
    }), [table, loading, hasPersistedState, resetPersistedState]);

    return (
        <DataTableContext.Provider value={value}>
            {children}
        </DataTableContext.Provider>
    );
}
