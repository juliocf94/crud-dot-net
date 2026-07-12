import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './provider/DataTableProvider';

export default function DataTableBody() {
    const { table } = useDataTableContext();
    console.log(table.getRowModel().rows);

    return (
        <tbody>
            {table.getRowModel().rows.length > 0 ?
                (
                    table.getRowModel().rows.map(row => (
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
                            No data available.
                        </td>
                    </tr>
                )
            }
        </tbody>
    );
}