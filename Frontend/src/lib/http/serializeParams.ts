import type { QueryParams } from './types';

/**
 * Serialización de query params: SOLO valores planos. Es intencional.
 *
 * No existe un estándar para codificar arrays/objetos anidados en un
 * query string: PHP espera `key[]=`, .NET espera claves repetidas o
 * `key[0]=`, Java Spring espera claves repetidas, etc. Si el cliente HTTP
 * asume alguno de estos formatos, queda acoplado a un backend específico.
 *
 * Para filtros complejos (arrays, rangos, objetos anidados) usar
 * http.search() con body JSON en vez de codificarlos en la URL.
 */
export function serializeParams(params: QueryParams = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

/**
 * --- Adaptadores OPCIONALES ---
 * Si un proyecto puntual sabe que su backend soporta un formato de
 * arrays/objetos en la URL, puede optar explícitamente por uno de estos
 * en vez de que el cliente HTTP lo asuma por todos.
 *
 * Uso:
 *   import { phpBracketSerializer } from '@/lib/http/serializeParams';
 *   const qs = phpBracketSerializer({ estado: ['A', 'B'] });
 */
export function phpBracketSerializer(params: Record<string, unknown> = {}): string {
  const searchParams = new URLSearchParams();

  const append = (key: string, value: unknown): void => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => append(`${key}[]`, item));
      return;
    }
    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) =>
        append(`${key}[${subKey}]`, subValue)
      );
      return;
    }
    searchParams.append(key, String(value));
  };

  Object.entries(params).forEach(([key, value]) => append(key, value));
  return searchParams.toString();
}

/** Formato de claves repetidas: key=A&key=B (lo que suele esperar Spring/.NET para listas) */
export function repeatKeySerializer(params: Record<string, unknown> = {}): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}