import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './provider/DataTableProvider';

export default function DataTableBody() {
    const { table } = useDataTableContext();

    return (
        <tbody>
            {table.getRowModel().rows.map(row => (
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
            ))}
        </tbody>
    );
}