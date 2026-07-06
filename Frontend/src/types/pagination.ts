export interface PaginationState {
    page: number;
    pageSize: number;
}

export interface PaginationInfo extends PaginationState {
    total: number;
    totalPages: number;
}