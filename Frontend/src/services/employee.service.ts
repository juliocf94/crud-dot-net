import type { EmployeeResponse } from "../types/employee";

export async function getEmployees(
    page: number,
    pageSize: number,
    search: string
): Promise<EmployeeResponse> {

    const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        search
    });

    const response = await fetch(
        `http://localhost:5171/api/employees?${params}`
    );

    if (!response.ok) {
        throw new Error("Error al obtener empleados");
    }

    return response.json();
}