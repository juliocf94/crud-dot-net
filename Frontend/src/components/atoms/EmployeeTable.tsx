import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type {
    ColumnDef
} from "@tanstack/react-table";

import type { Employee } from "../../types/employee";

interface Props {
    data: Employee[];
}

export default function EmployeeTable({ data }: Props) {

    const columns: ColumnDef<Employee>[] = [
        {
            accessorKey: "idEmployee",
            header: "ID"
        },
        {
            accessorKey: "nameEmployee",
            header: "Nombre"
        },
        {
            accessorKey: "lastNameEmployee",
            header: "Apellido"
        },
        {
            accessorKey: "birthdate",
            header: "Nacimiento"
        }
    ];

    const table = useReactTable({

        data,

        columns,

        getCoreRowModel: getCoreRowModel()

    });

    return (

        <table border={1}>

            <thead>

                {
                    table.getHeaderGroups().map(headerGroup => (

                        <tr key={headerGroup.id}>

                            {
                                headerGroup.headers.map(header => (

                                    <th key={header.id}>

                                        {
                                            flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )
                                        }

                                    </th>

                                ))
                            }

                        </tr>

                    ))
                }

            </thead>

            <tbody>

                {
                    table.getRowModel().rows.map(row => (

                        <tr key={row.id}>

                            {
                                row.getVisibleCells().map(cell => (

                                    <td key={cell.id}>

                                        {
                                            flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )
                                        }

                                    </td>

                                ))
                            }

                        </tr>

                    ))
                }

            </tbody>

        </table>

    );
}