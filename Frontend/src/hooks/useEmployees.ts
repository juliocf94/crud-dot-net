import { useEffect, useState } from 'react';
import { employeeService } from '@api/employee.service';
import { ApiError } from '@lib/http';
import type { EmployeeResponse } from '@typings/employee';

const { getEmployees } = employeeService;

interface UseEmployeesParams {
  page: number;
  pageSize: number;
  search: string;
}

export function useEmployees({ page, pageSize, search }: UseEmployeesParams) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<EmployeeResponse>({
    total: 0,
    page: 1,
    pageSize: 10,
    data: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getEmployees(
          { page, pageSize, search },
          { signal: controller.signal }
        );
        setResult(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err as ApiError);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, [page, pageSize, search]);

  return { loading, error, result };
}