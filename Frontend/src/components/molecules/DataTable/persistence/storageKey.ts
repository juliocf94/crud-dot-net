/**
 * Formato de clave recomendado por la spec: `datatable:<tableId>`.
 * Nunca utilizar nombres genéricos.
 */
export function buildTableStorageKey(tableId: string): string {
    return `datatable:${tableId}`;
}
