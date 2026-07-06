import { useCallback, useEffect, useState } from 'react';

import { employeeService } from '@api';

import { ApiError } from '@lib/http';

import type { EmployeeResponse } from '@typings/employee';

import type {
    PaginationInfo,
    PaginationState,
} from '@typings/pagination';

import type { EmployeeFilters } from '@typings/employee-filters';

const { getEmployees } = employeeService;

interface UseEmployeesParams {
    pagination: PaginationState;
    filters: EmployeeFilters;
}

export function useEmployees({
    pagination,
    filters,
}: UseEmployeesParams) {
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<ApiError | null>(null);

    const [result, setResult] = useState<EmployeeResponse>({
        total: 0,
        page: 1,
        pageSize: 10,
        data: [],
    });

    const load = useCallback(async () => {
        const controller = new AbortController();

        setLoading(true);

        setError(null);

        try {
            const response = await getEmployees(
                {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    search: filters.search,
                },
                {
                    signal: controller.signal,
                }
            );

            setResult(response);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;

            setError(err as ApiError);
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, [pagination, filters]);

    useEffect(() => {
        load();
    }, [load]);

    const paginationInfo: PaginationInfo = {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages:
            result.totalPages ??
            Math.ceil(result.total / result.pageSize),
    };

    return {
        employees: result.data,
        pagination: paginationInfo,
        loading,
        error,
        refresh: load,
    };
}