import type { PaginationState } from '@tanstack/react-table';
import type {
    ServerPaginationState,
} from '@typings/pagination';

/**
 * Convierte la paginación del backend
 * al formato utilizado por TanStack.
 */
export function toTablePagination(
    pagination: ServerPaginationState,
): PaginationState {

    return {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
    };

}

/**
 * Convierte la paginación de TanStack
 * al formato esperado por la API.
 */
export function toServerPagination(
    pagination: PaginationState,
): ServerPaginationState {

    return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
    };

}