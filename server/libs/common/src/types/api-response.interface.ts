export interface ApiSuccessResponse<T = any> {
  success: true;
  statusCode: number;
  message: string;
  data: T[] | null | Record<string, any>;
  timestamp: string;
}

// null -> single resourse endpoint with no data
// [] -> multiple resourse endpoint with no data
// Record<string, any> -> single resourse endpoint with data
// T[] -> multiple resourse endpoint with data

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errors: any[];
  timestamp: string;
}

// [] -> when no field errors to show
// [{}] -> when field errors to show

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// {
//   "success": true,
//   "statusCode": 200,
//   "message": "Users retrieved successfully",
//   "data": {
//     "items": [
//       { "id": 1, "name": "Alice" },
//       { "id": 2, "name": "Bob" }
//     ],
//     "pagination": {
//       "total": 50,
//       "page": 1,
//       "limit": 10,
//       "totalPages": 5
//     }
//   },
//   "timestamp": "2025-08-24T13:52:00.000Z"
// }
