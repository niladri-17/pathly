export interface ApiSuccessResponse<T = any> {
  success: true;
  statusCode: number;
  message: string;
  data: T[] | null;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors: any[];
  timestamp: string;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
