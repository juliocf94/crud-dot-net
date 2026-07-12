import { DEFAULT_PAGE_SIZES } from '../defaults';
import { useDataTableContext } from '../provider';

export default function Pagination() {
    const { table } = useDataTableContext();
    const {
        pageIndex,
        pageSize,
    } = table.getState().pagination;

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginTop: '1rem',
            }}
        >

            <button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>

            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>

            <span>

                Página{' '}

                <strong>

                    {pageIndex + 1}

                    {' de '}

                    {table.getPageCount()}

                </strong>

            </span>

            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>

            <button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>>'}
            </button>

            <span>|</span>

            <select
                value={pageSize}
                onChange={(event) => {

                    table.setPageSize(
                        Number(event.target.value),
                    );

                }}
            >

                {DEFAULT_PAGE_SIZES.map(size => (

                    <option
                        key={size}
                        value={size}
                    >
                        Mostrar {size}
                    </option>

                ))}

            </select>
        </div>
    );
}