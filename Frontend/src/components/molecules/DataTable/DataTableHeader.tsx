import { flexRender } from '@tanstack/react-table';

import type { DataTableComponentProps } from './types';

export default function DataTableHeader<TData>({ table, }: DataTableComponentProps<TData>) {

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