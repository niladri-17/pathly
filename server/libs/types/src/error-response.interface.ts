export interface ErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string | Record<string, any>[];
}
