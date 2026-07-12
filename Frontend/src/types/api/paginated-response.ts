import type { PaginationMetadata } from '@typings/pagination';

export interface PaginatedResponse<T> extends PaginationMetadata {
    data: T[];
}