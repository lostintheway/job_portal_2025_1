export interface ResponseWithTotal<T> {
  total: number;
  data: T;
  page: number;
  size: number;
}
