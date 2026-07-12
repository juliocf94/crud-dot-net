import { DataTableProvider } from './provider/DataTableProvider';

import DataTableHeader from './DataTableHeader';
import DataTableBody from './DataTableBody';
import DataTablePagination from './DataTablePagination';

import type { ServerPaginationState } from '@typings/pagination';

interface Props<TData> {
    data: TData[];
    columns: any;

    pagination: ServerPaginationState;
    onPaginationChange: (pagination: ServerPaginationState) => void;

    toolbar?: React.ReactNode;
    footer?: React.ReactNode;
    emptyMessage?: React.ReactNode;
}

export default function DataTable<TData>({
    data,
    columns,
    pagination,
    onPaginationChange,

    toolbar,
    footer,
    emptyMessage = 'No data available.',
}: Props<TData>) {

    return (
        <DataTableProvider
            data={data}
            columns={columns}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* SLOT: Toolbar (futuro) */}
                {toolbar && (
                    <div>
                        {toolbar}
                    </div>
                )}

                {/* TABLE CORE */}
                <table>
                    <DataTableHeader />
                    <DataTableBody emptyMessage={emptyMessage} />
                </table>

                {/* PAGINATION */}
                <DataTablePagination />

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