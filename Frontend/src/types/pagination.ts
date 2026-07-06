/**
 * Estado de paginación utilizado por la aplicación
 * y enviado hacia el backend.
 */
export interface ServerPaginationState {
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * Información de paginación retornada por la API.
 */
export interface PaginationInfo extends ServerPaginationState {
    total: number;
    totalPages: number;
}