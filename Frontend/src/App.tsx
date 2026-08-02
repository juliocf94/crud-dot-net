import { useState } from 'react';
import DataTable, { loadPersistedTableState } from '@components/molecules/DataTable';
import { EMPLOYEE_COLUMNS } from '@constants/columns/employee.columns';
import { useEmployees } from '@hooks/useEmployees';
import type { PaginationRequest } from '@typings/pagination';

const EMPLOYEES_TABLE_ID = 'employees';

function App() {
    // Restaurar antes del primer request: sembramos el estado inicial de
    // paginación desde el mismo almacenamiento que usará la DataTable, para
    // que `useEmployees` nunca dispare un request con la página 1 por defecto.
    const [pagination, setPagination] = useState<PaginationRequest>(() => {
        const restored = loadPersistedTableState(EMPLOYEES_TABLE_ID);

        return restored?.pagination ?? {
            page: 1,
            pageSize: 10,
        };
    });
    const [filters, setFilters] = useState({
        search: '',
    });

    const {
        employees,
        pagination: PaginationResponse,
        loading,
    } = useEmployees({
        pagination,
        filters: filters,
    });

    return (
        <DataTable
            tableId={EMPLOYEES_TABLE_ID}
            persist

            data={employees}
            columns={EMPLOYEE_COLUMNS}

            loading={loading}
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