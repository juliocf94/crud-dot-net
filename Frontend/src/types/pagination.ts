/**
 * Estado de paginación utilizado por la aplicación
 * y enviado hacia el backend.
 */
// La interfaz y contrato entre el backend y la aplicación
export interface PaginationRequest {
    page: number;
    pageSize: number;
}

/**
 * Información de paginación retornada por la API.
 */
// Contrato entre la aplicación y la API, esta interfaz es una representación de la respuesta de la API
export interface PaginationMetadata extends PaginationRequest {
    total: number;
    totalPages: number;
}