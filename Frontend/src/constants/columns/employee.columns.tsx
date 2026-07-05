import type { ColumnDef } from '@tanstack/react-table';
import type { Employee } from '@typings/employee';
import { textColumn, dateColumn, statusColumn } from '@helpers/table/column-helpers';

export const EMPLOYEE_COLUMNS: ColumnDef<Employee>[] = [
  textColumn('idEmployee', 'ID'),
  textColumn('nameEmployee', 'Nombre'),
  textColumn('lastNameEmployee', 'Apellido'),
  dateColumn('birthdate', 'Nacimiento'),
  statusColumn('statusEmployee', 'Estado'),
];