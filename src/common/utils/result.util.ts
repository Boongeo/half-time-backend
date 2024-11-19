import { Result } from '../interfaces/result.interface';

export function successResult<T>(data?: T): Result<T> {
  return {
    success: true,
    data,
  };
}

export function failureResult<T>(error: string): Result<T> {
  return {
    success: false,
    error,
  };
}
