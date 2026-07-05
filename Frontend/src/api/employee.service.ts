import type { EmployeeResponse } from "@typings/employee";
import { EMPLOYEE_ENDPOINTS } from '@constants/endpoints';
import { http } from '@lib/http';

const { BASE } = EMPLOYEE_ENDPOINTS;
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
        BASE,
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