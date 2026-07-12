import type {
    ColumnDef
} from '@tanstack/react-table';
import { DataTableProvider } from './provider/DataTableProvider';

import Header from './components/Header';
import DataTableBody from './components/Body';
import Pagination from './components/Pagination';

import type { PaginationRequest, PaginationMetadata } from '@typings/pagination';

interface Props<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];

    pagination: PaginationMetadata;
    onPaginationChange: (pagination: PaginationRequest) => void;

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