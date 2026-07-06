import { flexRender } from '@tanstack/react-table';
import { useDataTableContext } from './provider/DataTableProvider';

export default function DataTableHeader() {

    const { table } = useDataTableContext();

    return (
        <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                )}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    );
}