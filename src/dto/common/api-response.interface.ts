/**
 * Estructura estándar para todas las respuestas de la API
 */
export interface ApiResponse<T> {
  payload: T;
  statusCode?: number;
  message?: string;
}
