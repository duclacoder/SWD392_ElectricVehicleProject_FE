export interface ResponseDTO<T> {
  message: string;
  statusCode: number;
  isSuccess: boolean;
  result: T;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
