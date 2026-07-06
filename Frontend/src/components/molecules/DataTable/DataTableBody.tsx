import { flexRender } from '@tanstack/react-table';

import type { DataTableComponentProps } from './types';

export default function DataTableBody<TData>({ table, }: DataTableComponentProps<TData>) {

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