import {
    getCoreRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
    type RowSelectionState,
} from '@tanstack/react-table';

import { useMemo, useState } from 'react';

import type { DataTableProps } from './types';

import { toTablePagination } from './utils/pagination-adapter';

import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';

export default function DataTable<TData>({
    data,
    columns,
    pagination,
    onPaginationChange,
}: DataTableProps<TData>) {

    /**
     * Estado del ordenamiento.
     */
    const [sorting, setSorting] = useState<SortingState>([]);

    /**
     * Columnas visibles.
     */
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({});

    /**
     * Filas seleccionadas.
     */
    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>({});

    /**
     * Adaptamos la paginación del backend
     * al formato esperado por TanStack.
     */
    const tablePagination = useMemo(
        () => toTablePagination(pagination),
        [pagination],
    );

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

            onPaginationChange(next);

        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),

    });

    console.log(table);

    return (
        <div>
            <table>
                <DataTableHeader table={table} />
                <DataTableBody table={table} />
            </table>
            <DataTablePagination table={table} />
        </div>
    );

}