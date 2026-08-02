import type {
    ColumnDef,
    ColumnOrderState,
    ColumnSizingState,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import { DataTableProvider } from './provider/DataTableProvider';

import Header from './components/Header';
import DataTableBody from './components/Body';
import Pagination from './components/Pagination';
import ResetStateButton from './components/ResetStateButton';

import type { PaginationRequest, PaginationMetadata } from '@typings/pagination';

interface Props<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading: boolean;

    pagination: PaginationMetadata;
    onPaginationChange: (pagination: PaginationRequest) => void;

    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    emptyMessage?: React.ReactNode;

    tableId?: string;
    persist?: boolean;
    initialSorting?: SortingState;
    initialColumnVisibility?: VisibilityState;
    initialColumnOrder?: ColumnOrderState;
    initialColumnSizing?: ColumnSizingState;
    initialRowSelection?: RowSelectionState;
}

export default function DataTable<TData>({
    data,
    columns,
    pagination,
    loading,
    onPaginationChange,

    toolbar,
    footer,
    emptyMessage = 'No data available.',

    tableId,
    persist = false,
    initialSorting,
    initialColumnVisibility,
    initialColumnOrder,
    initialColumnSizing,
    initialRowSelection,
}: Props<TData>) {

    return (
        <DataTableProvider
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            loading={loading}

            tableId={tableId}
            persist={persist}
            initialSorting={initialSorting}
            initialColumnVisibility={initialColumnVisibility}
            initialColumnOrder={initialColumnOrder}
            initialColumnSizing={initialColumnSizing}
            initialRowSelection={initialRowSelection}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* SLOT: Toolbar (futuro) */}
                {toolbar && (
                    <div>
                        {toolbar}
                    </div>
                )}

                {persist && (
                    <ResetStateButton />
                )}

                {/* TABLE CORE */}
                <table>
                    <Header />
                    <DataTableBody emptyMessage={emptyMessage} />
                </table>

                {/* PAGINATION */}
                <Pagination />

                {/* SLOT: Footer */}
                {footer && (
                    <div>
                        {footer}
                    </div>
                )}

            </div>
        </DataTableProvider>
    );
}