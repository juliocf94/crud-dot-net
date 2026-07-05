// Factories para construir ColumnDef sin repetir boilerplate en cada archivo de columnas

import type { ColumnDef } from '@tanstack/react-table';

/** Columna de texto simple, sin transformación. */
export function textColumn<T>(accessorKey: keyof T & string, header: string): ColumnDef<T> {
    return { accessorKey, header };
}

/** Columna de fecha: recibe un ISO string del backend y lo formatea a fecha local. */
export function dateColumn<T>(
    accessorKey: keyof T & string,
    header: string,
    locale: string = 'es-SV'
): ColumnDef<T> {
    return {
        accessorKey,
        header,
        cell: (info) => {
            const raw = info.getValue<string | null>();
            if (!raw) return '—';
            return new Date(raw).toLocaleDateString(locale);
        },
    };
}

/** Columna de estado: mapea un código (ej. 'A' / 'I') a una etiqueta legible. */
export function statusColumn<T>(
    accessorKey: keyof T & string,
    header: string,
    labels: Record<string, string> = { A: 'Activo', I: 'Inactivo' }
): ColumnDef<T> {
    return {
        accessorKey,
        header,
        cell: (info) => {
            const raw = info.getValue<string>();
            return labels[raw] ?? raw;
        },
    };
}