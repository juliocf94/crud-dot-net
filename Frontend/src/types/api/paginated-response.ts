import type { PaginationInfo } from '@typings/pagination';

export interface PaginatedResponse<T> extends PaginationInfo {
    data: T[];
}