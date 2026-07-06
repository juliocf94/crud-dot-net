import type { PaginatedResponse } from "@typings/api/paginated-response";

export interface Employee {
    idEmployee: number;
    nameEmployee: string;
    lastNameEmployee: string;
    birthdate: string;
    statusEmployee: string;
    createAt: string;
}

export type EmployeeResponse = PaginatedResponse<Employee>;