import { useState } from 'react';
import DataTable from '@components/molecules/DataTable';
import { EMPLOYEE_COLUMNS } from '@constants/columns/employee.columns';
import { useEmployees } from '@hooks/useEmployees';
import type { PaginationRequest } from '@typings/pagination';

function App() {
    const [pagination, setPagination] = useState<PaginationRequest>({
        page: 1,
        pageSize: 10,
    });
    const [filters, setFilters] = useState({
        search: '',
    });

    const {
        employees,
        pagination: PaginationResponse,
        // loading,
    } = useEmployees({
        pagination,
        filters: filters,
    });

    return (
        <DataTable
            data={employees}
            columns={EMPLOYEE_COLUMNS}

            //loading={loading}
            emptyMessage="No hay empleados."
            pagination={PaginationResponse}
            onPaginationChange={(pagination) => {
                // FIX: Se debe pasar el objeto de estado de la tabla
                setPagination(pagination);
            }}
        />
    );
}

export default App;