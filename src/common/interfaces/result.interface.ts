export type PaginatedResult<T> = {
  items: T[];
  page: number;
  size: number;
};

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
