export interface Employee {
    idEmployee: number;
    nameEmployee: string;
    lastNameEmployee: string;
    birthdate: string;
    statusEmployee: string;
    createAt: string;
}

export interface EmployeeResponse {
    total: number;
    page: number;
    pageSize: number;
    data: Employee[];
}