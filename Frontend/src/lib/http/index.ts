// src/lib/http/index.ts
export { http, configureHttp, ApiError } from './httpClient';
export type { QueryParams, RequestOptions, UploadOptions, DownloadResult, Page } from './types';

// Adaptadores de serialización opcionales: solo si un proyecto puntual
// sabe que su backend los soporta. No se usan por defecto.
export { phpBracketSerializer, repeatKeySerializer } from './serializeParams';