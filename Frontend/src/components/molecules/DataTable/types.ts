import type {
    ColumnDef,
    PaginationState,
    Table,
} from '@tanstack/react-table';

import type { PaginationInfo } from '@typings/pagination';

export interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading?: boolean;
    emptyMessage?: string;
    pagination: PaginationInfo;

    /**
     * Se dispara cuando TanStack cambia
     * la página o el tamaño.
     */
    onPaginationChange(
        pagination: PaginationState
    ): void;
}

export interface DataTableComponentProps<TData> {
    table: Table<TData>;
}