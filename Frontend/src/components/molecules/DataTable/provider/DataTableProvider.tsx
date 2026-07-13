import {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';

import {
    useReactTable,
    getCoreRowModel,
    type SortingState,
    type VisibilityState,
    type RowSelectionState,
    type PaginationState,
    type ColumnDef,
} from '@tanstack/react-table';

import type {
    PaginationMetadata, PaginationRequest
} from '@typings/pagination';

import { toTablePagination, toServerPagination } from '../utils/pagination-adapter';

interface DataTableContextValue<TData> {
    table: ReturnType<typeof useReactTable<TData>>;
    loading: boolean;
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

    children: React.ReactNode;
}

export function DataTableProvider<TData>({
    data,
    columns,
    pagination,
    loading,
    onPaginationChange,
    children,
}: DataTableProviderProps<TData>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const tablePagination = useMemo<PaginationState>(() => {
        return toTablePagination(pagination);
    }, [pagination]);

    const table = useReactTable({
        data,
        columns,

        state: {
            pagination: tablePagination,
            sorting,
            columnVisibility,
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
        onRowSelectionChange: setRowSelection,

        getCoreRowModel: getCoreRowModel(),
    });

    const value = useMemo(() => ({
        table,
        loading,
    }), [table, loading]);

    return (
        <DataTableContext.Provider value={value}>
            {children}
        </DataTableContext.Provider>
    );
}