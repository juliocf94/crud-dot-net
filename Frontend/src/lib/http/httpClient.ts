// src/lib/http/httpClient.ts
import { ApiError } from './types';
import type { DownloadResult, ErrorHandler, QueryParams, RequestOptions, UploadOptions } from './types';
import { serializeParams } from './serializeParams';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const DEFAULT_HEADERS: Record<string, string> = {
  Accept: 'application/json',
};

// ---------------------------------------------------------------------------
// Manejo de errores centralizado (reemplaza al APP.helpers.toast acoplado
// que tenías comentado como pendiente). Se configura una sola vez, por
// ejemplo en main.tsx, y queda desacoplado de qué librería de UI se use.
// ---------------------------------------------------------------------------
let globalErrorHandler: ErrorHandler | null = null;

// Por defecto no transformamos nada: cada backend puede envolver sus
// respuestas distinto (Laravel: {data, meta}, NestJS: {data} o array
// pelado, .NET: {items, totalCount}, Spring: {content, totalElements}).
// Configurando esto una vez, tus componentes de React dejan de conocer
// la forma cruda del backend y solo hablan el contrato que tú definas.
let responseNormalizer: (<T>(raw: unknown) => T) | null = null;

function configureHttp(options: { onError?: ErrorHandler; normalizeResponse?: <T>(raw: unknown) => T }): void {
  globalErrorHandler = options.onError ?? null;
  responseNormalizer = options.normalizeResponse ?? null;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function notifyError(error: ApiError): void {
  globalErrorHandler?.(error);
}

async function parseBody<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  // Respuestas no-JSON (texto plano, HTML de error, etc.) se devuelven tal cual
  return (await response.text()) as unknown as T;
}

function buildHeaders(extra?: Record<string, string>, withJson = false): Record<string, string> {
  return {
    ...DEFAULT_HEADERS,
    ...(withJson ? { 'Content-Type': 'application/json' } : {}),
    ...(extra || {}),
  };
}

async function coreRequest<T>(path: string, init: RequestInit, options: RequestOptions = {}): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: options.signal,
      headers: {
        ...(init.headers as Record<string, string>),
        ...(options.headers || {}),
      },
    });

    const data = await parseBody<T>(response);

    if (!response.ok) {
      throw new ApiError({
        status: response.status,
        message: (data as { message?: string })?.message || 'Error en la petición',
        data,
      });
    }

    return responseNormalizer ? responseNormalizer<T>(data) : data;
  } catch (error) {
    if (isAbortError(error)) throw error;

    const apiError =
      error instanceof ApiError
        ? error
        : new ApiError({ status: 0, message: (error as Error).message || 'Error de red' });

    notifyError(apiError);
    throw apiError;
  }
}

// ---------------------------------------------------------------------------
// Métodos JSON estándar
// ---------------------------------------------------------------------------

function get<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(path, { method: 'GET', headers: buildHeaders() }, options);
}

/**
 * GET con params planos (page, sort, id, etc.) — el subconjunto que sí
 * se interpreta igual en cualquier backend. Para filtros con arrays u
 * objetos anidados usar http.search().
 */
function query<T = unknown>(path: string, params: QueryParams = {}, options?: RequestOptions): Promise<T> {
  const qs = serializeParams(params);
  const fullPath = qs ? `${path}?${qs}` : path;
  return coreRequest<T>(fullPath, { method: 'GET', headers: buildHeaders() }, options);
}

/**
 * Para filtros complejos (arrays, rangos, objetos anidados) NO los metemos
 * en un query string (no hay estándar universal para eso). Se envían como
 * body JSON, que sí es un formato universal en cualquier backend.
 * Convención REST: POST /recurso/search.
 */
function search<T = unknown, TFilters = unknown>(path: string, filters?: TFilters, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(
    path,
    {
      method: 'POST',
      headers: buildHeaders(undefined, true),
      body: JSON.stringify(filters ?? {}),
    },
    options
  );
}

function post<T = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(
    path,
    { method: 'POST', headers: buildHeaders(undefined, body !== undefined), body: body !== undefined ? JSON.stringify(body) : undefined },
    options
  );
}

function put<T = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(
    path,
    { method: 'PUT', headers: buildHeaders(undefined, body !== undefined), body: body !== undefined ? JSON.stringify(body) : undefined },
    options
  );
}

function patch<T = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(
    path,
    { method: 'PATCH', headers: buildHeaders(undefined, body !== undefined), body: body !== undefined ? JSON.stringify(body) : undefined },
    options
  );
}

function destroy<T = unknown, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions): Promise<T> {
  return coreRequest<T>(
    path,
    { method: 'DELETE', headers: buildHeaders(undefined, body !== undefined), body: body !== undefined ? JSON.stringify(body) : undefined },
    options
  );
}

// ---------------------------------------------------------------------------
// Descarga de archivos
// ---------------------------------------------------------------------------

function extractFilename(disposition: string | null): string | null {
  if (!disposition) return null;
  const match = /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(disposition);
  return match ? decodeURIComponent(match[1]) : null;
}

async function download(path: string, params: QueryParams = {}, options: RequestOptions = {}): Promise<DownloadResult> {
  const qs = serializeParams(params);
  const fullPath = qs ? `${path}?${qs}` : path;

  try {
    const response = await fetch(`${BASE_URL}${fullPath}`, {
      method: 'GET',
      signal: options.signal,
      headers: { ...(options.headers || {}) },
    });

    if (!response.ok) {
      const data = await parseBody<{ message?: string }>(response);
      throw new ApiError({ status: response.status, message: data?.message || 'Error al descargar el archivo', data });
    }

    const blob = await response.blob();
    const filename = extractFilename(response.headers.get('content-disposition'));
    return { blob, filename };
  } catch (error) {
    if (isAbortError(error)) throw error;
    const apiError = error instanceof ApiError ? error : new ApiError({ status: 0, message: (error as Error).message });
    notifyError(apiError);
    throw apiError;
  }
}

/** Dispara la descarga en el navegador a partir de un blob ya obtenido. */
function triggerBlobDownload(blob: Blob, filename = 'download'): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Subida de archivos con progreso (XMLHttpRequest es el único que expone
// el evento de progreso de UPLOAD; fetch no lo soporta).
// ---------------------------------------------------------------------------

function upload<T = unknown>(path: string, formData: FormData, options: UploadOptions = {}): Promise<T> {
  const { onProgress, signal, headers, method = 'POST' } = options;

  return new Promise<T>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${BASE_URL}${path}`);

    Object.entries(headers || {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.upload.onprogress = (event) => {
      if (onProgress && event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100), event);
      }
    };

    xhr.onabort = () => reject(new DOMException('Aborted', 'AbortError'));

    xhr.onerror = () => {
      const apiError = new ApiError({ status: xhr.status, message: 'Error de red durante la subida' });
      notifyError(apiError);
      reject(apiError);
    };

    xhr.onload = () => {
      const contentType = xhr.getResponseHeader('content-type') || '';
      let data: unknown = xhr.responseText;

      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(xhr.responseText);
        } catch {
          // dejamos el texto crudo si el JSON viene corrupto
        }
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
      } else {
        const apiError = new ApiError({
          status: xhr.status,
          message: (data as { message?: string })?.message || 'Error en la subida del archivo',
          data,
        });
        notifyError(apiError);
        reject(apiError);
      }
    };

    // No seteamos Content-Type manualmente: el navegador define el
    // boundary correcto del multipart/form-data automáticamente.
    xhr.send(formData);
  });
}

export const http = {
  get,
  query,
  search,
  post,
  put,
  patch,
  destroy,
  upload,
  download,
  triggerBlobDownload,
};

export { ApiError, configureHttp };
export type { QueryParams, RequestOptions, UploadOptions, DownloadResult };