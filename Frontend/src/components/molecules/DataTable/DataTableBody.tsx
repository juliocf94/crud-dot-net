import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './provider/DataTableProvider';

interface DataTableBodyProps {
    emptyMessage?: React.ReactNode;
}

export default function DataTableBody<TBody>({ emptyMessage = 'No data available.', }: DataTableBodyProps) {
    const { table } = useDataTableContext<TBody>();
    const rowsModel = table.getRowModel().rows;
    const hasRows = Array.isArray(rowsModel) && rowsModel.length > 0;

    return (
        <tbody>
            {hasRows ?
                (
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
                ) : (
                    /* Empty State Block */
                    <tr>
                        <td colSpan={table.getVisibleFlatColumns().length}>
                            {emptyMessage}
                        </td>
                    </tr>
                )
            }
        </tbody>
    );
}