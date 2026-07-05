/**
 * Valores primitivos aceptados dentro de un set de query params.
 */
export type QueryPrimitive = string | number | boolean | null | undefined;

/**
 * QueryParams se limita a valores planos a propósito. La codificación de
 * arrays/objetos anidados en un query string NO es un estándar (cada
 * lenguaje/framework lo parsea distinto), así que el cliente HTTP no debe
 * asumir ningún formato particular. Para filtros complejos, usar
 * http.search() con body JSON, que sí es universal.
 */
export type QueryParams = Record<string, QueryPrimitive>;

/**
 * Forma canónica a la que normalizamos CUALQUIER respuesta paginada,
 * sin importar si el backend original es Laravel ({data, meta}),
 * NestJS ({data}), .NET ({items, totalCount}) o Spring ({content, totalElements}).
 * Los componentes de React solo conocen esta forma.
 */
export interface Page<TItem> {
  items: TItem[];
  total: number;
  page: number;
  pageSize: number;
}

export type ResponseNormalizer = <T>(rawData: unknown) => T;

export interface ApiErrorShape<TData = unknown> {
  status: number;
  message: string;
  data?: TData;
}

/**
 * Error unificado para toda la capa HTTP. Tanto fetch como XHR
 * (upload) terminan lanzando esta misma clase, así el código que
 * consume http.* solo necesita manejar un tipo de error.
 */
export class ApiError<TData = unknown> extends Error implements ApiErrorShape<TData> {
  status: number;
  data?: TData;

  constructor({ status, message, data }: ApiErrorShape<TData>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface UploadOptions {
  method?: 'POST' | 'PUT' | 'PATCH';
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Porcentaje (0-100) + evento nativo, para barras de progreso en React state */
  onProgress?: (percent: number, event: ProgressEvent) => void;
}

export interface DownloadResult {
  blob: Blob;
  filename: string | null;
}

export type ErrorHandler = (error: ApiError) => void;