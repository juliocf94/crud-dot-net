// src/constants/endpoints/employee.endpoints.ts

/**
 * Único lugar donde vive el string de ruta para el dominio "employees".
 * Si el backend cambia /employees por /staff, se edita UNA línea aquí
 * y ningún service.ts se toca.
 *
 * Los endpoints dinámicos son funciones (no strings) para que TypeScript
 * obligue a pasar el parámetro correcto, en vez de template strings sueltos
 * repetidos en cada archivo que necesite un ID.
 */
export const EMPLOYEE_ENDPOINTS = {
  BASE: '/employees',
  BY_ID: (id: number | string) => `/employees/${id}`,
  DOCUMENTS: (id: number | string) => `/employees/${id}/documents`,
} as const;