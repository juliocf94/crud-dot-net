import { useEffect, useState } from "react";
import { getEmployees } from "../services/employee.service";
import type { EmployeeResponse } from "../types/employee";

export function useEmployees(
    page: number,
    pageSize: number,
    search: string
) {

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState<EmployeeResponse>({
        total: 0,
        page: 1,
        pageSize: 10,
        data: []
    });

    useEffect(() => {

        async function load() {

            setLoading(true);

            try {

                const data = await getEmployees(
                    page,
                    pageSize,
                    search
                );

                setResult(data);

            } finally {

                setLoading(false);

            }
        }

        load();

    }, [page, pageSize, search]);

    return {
        loading,
        result
    };
}