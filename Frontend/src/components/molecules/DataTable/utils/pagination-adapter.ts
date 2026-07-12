import type { PaginationState } from '@tanstack/react-table';
import type { PaginationRequest } from '@typings/pagination';

/**
 * Convierte la paginación del backend
 * al formato utilizado por TanStack.
 */
export function toTablePagination(pagination: PaginationRequest,): PaginationState {

    return {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
    };

}

/**
 * Convierte la paginación de TanStack
 * al formato esperado por la API.
 */
export function toServerPagination(pagination: PaginationState,): PaginationRequest {
    console.log("pagination", pagination);
    console.log("index", pagination.pageIndex);
    console.log("size", pagination.pageSize);
    return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
    };

}