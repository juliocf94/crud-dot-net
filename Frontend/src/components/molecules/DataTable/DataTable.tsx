import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';

interface Props<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    loading?: boolean;
    emptyMessage?: string;
}

/**
 * Recibe data + columns como props, así que cualquier listado nuevo (products,
 * departments, invoices...) reutiliza este mismo componente sin tocarlo.
 * Las columnas de cada entidad viven en su propio archivo bajo
 * src/constants/columns/*.columns.tsx
 */
export default function DataTable<TData>({
    data,
    columns,
    loading = false,
    emptyMessage = 'Sin resultados',
}: Props<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (loading) {
        return <p>Cargando...</p>;
    }

    if (data.length === 0) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <table border={1}>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}