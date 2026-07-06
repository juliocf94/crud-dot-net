import { useState } from "react";
import DataTable from '@components/molecules/DataTable/DataTable';
import { EMPLOYEE_COLUMNS } from '@constants/columns/employee.columns';
import { useEmployees } from "@hooks/useEmployees";

function App() {

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [filters, setFilters] = useState({
    search: "",
  });

  const {
    employees,
    loading,
    pagination: paginationInfo,
  } = useEmployees({
    pagination,
    filters,
  });

  //const totalPages = Math.ceil(result.total / pageSize);

  return (
    <>
      <input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <DataTable
        data={employees}
        columns={EMPLOYEE_COLUMNS}
        loading={loading}
      />

      <br />

      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
      >
        Anterior
      </button>

      <span>Página {page} de {totalPages}</span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(p => p + 1)}
      >
        Siguiente
      </button>

      <select
        value={pageSize}
        onChange={(e) => {

          setPageSize(Number(e.target.value));
          setPage(1);

        }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </>
  );
}

export default App;