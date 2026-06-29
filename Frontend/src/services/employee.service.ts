import type { EmployeeResponse } from "../types/employee";

export async function getEmployees(
    page: number,
    pageSize: number,
    search: string
): Promise<EmployeeResponse> {

    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    if (search.trim() !== "") {
        params.append("search", search);
    }

    const url = `http://localhost:5171/api/employees?${params}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error al obtener empleados");
    }

    return response.json();
}