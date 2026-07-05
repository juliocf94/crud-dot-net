import type { EmployeeResponse } from "@typings/employee";
import { http } from '@lib/http';

interface RequestOptions {
    signal?: AbortSignal;
}

interface GetEmployeesParams {
    page: number;
    pageSize: number;
    search?: string;
}

async function getEmployees(
    { page, pageSize, search }: GetEmployeesParams,
    options?: RequestOptions
): Promise<EmployeeResponse> {
    return http.query<EmployeeResponse>(
        '/employees',
        {
            page,
            pageSize,
            ...(search?.trim() ? { search: search.trim() } : {}),
        },
        options
    );
}

export const employeeService = {
    getEmployees: getEmployees
}