import { useState } from 'react';

import DataTable from '@components/molecules/DataTable';

import { EMPLOYEE_COLUMNS } from '@constants/columns/employee.columns';

import { useEmployees } from '@hooks/useEmployees';

import { toServerPagination } from '@components/molecules/DataTable/utils/pagination-adapter';

import type { ServerPaginationState } from '@typings/pagination';

function App() {

    const [pagination, setPagination] =
        useState<ServerPaginationState>({
            page: 1,
            pageSize: 10,
        });

    const {

        employees,

        pagination: paginationInfo,

        loading,

    } = useEmployees({

        pagination,

        filters: {

            search: '',

        },

    });

    return (

        <DataTable

            data={employees}

            columns={EMPLOYEE_COLUMNS}

            loading={loading}

            pagination={paginationInfo}

            onPaginationChange={(state) => {

                setPagination(
                    toServerPagination(state),
                );

            }}

        />

    );

}

export default App;