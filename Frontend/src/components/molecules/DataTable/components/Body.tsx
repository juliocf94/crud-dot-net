import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from '../provider';

import Loading from './Loading';
import DataTableEmpty from './DataTableEmpty';

interface DataTableBodyProps {
    emptyMessage?: React.ReactNode;
}

export default function DataTableBody<TBody>({ emptyMessage = 'No data available.', }: DataTableBodyProps) {
    const { table, loading } = useDataTableContext<TBody>();
    const rowsModel = table.getRowModel().rows;
    const hasRows = Array.isArray(rowsModel) && rowsModel.length > 0;

    return (
        <tbody>
            {loading && (
                <Loading />
            )}

            {!loading && !hasRows && (
                <DataTableEmpty>
                    {emptyMessage}
                </DataTableEmpty>
            )}

            {!loading && hasRows && (
                rowsModel.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                )}
                            </td>
                        ))}
                    </tr>
                ))
            )}
        </tbody>
    );
}