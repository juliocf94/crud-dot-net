export interface PaginatedResponse<T> {
    total: number;
    page: number;
    pageSize: number;

    /**
     * El backend puede devolverlo en un futuro.
     * Mientras tanto lo calcularemos en el frontend.
     */
    totalPages?: number;

    data: T[];
}