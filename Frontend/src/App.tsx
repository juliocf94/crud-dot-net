import { useState } from "react";
import EmployeeTable from "./components/atoms/EmployeeTable";
import { useEmployees } from "./hooks/useEmployees";

function App() {

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [search, setSearch] = useState("");

  const { result, loading } = useEmployees(
    page,
    pageSize,
    search
  );

  const totalPages = Math.ceil(
    result.total / pageSize
  );

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

      {
        loading
          ? <p>Cargando...</p>
          : <EmployeeTable data={result.data} />
      }

      <br />

      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
      >
        Anterior
      </button>

      <span>

        Página {page} de {totalPages}

      </span>

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