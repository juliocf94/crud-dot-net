import type {
    ColumnDef,
    ColumnOrderState,
    ColumnSizingState,
    PaginationState,
    RowSelectionState,
    SortingState,
    Table,
    VisibilityState,
} from '@tanstack/react-table';

import type { PaginationMetadata } from '@typings/pagination';

export interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading?: boolean;
    emptyMessage?: string;
    pagination: PaginationMetadata;

    /**
     * Se dispara cuando TanStack cambia
     * la página o el tamaño.
     */
    onPaginationChange(
        pagination: PaginationState
    ): void;

    /**
     * Identificador único de esta tabla. Obligatorio cuando `persist`
     * está habilitado (clave de almacenamiento: `datatable:<tableId>`).
     */
    tableId?: string;

    /**
     * Habilita/deshabilita la persistencia automática del estado
     * completo de la tabla (paginación, orden, visibilidad de
     * columnas, etc.) en LocalStorage. `false` por defecto.
     */
    persist?: boolean;

    /** Props iniciales: usadas solo si no hay estado persistido. */
    initialSorting?: SortingState;
    initialColumnVisibility?: VisibilityState;
    initialColumnOrder?: ColumnOrderState;
    initialColumnSizing?: ColumnSizingState;
    initialRowSelection?: RowSelectionState;
}

export interface DataTableComponentProps<TData> {
    table: Table<TData>;
}