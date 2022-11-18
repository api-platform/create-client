export interface Pagination {
  sortBy?: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber: number;
}

export interface Filters {
  [key: string]: string;
}

export interface ListParams {
  pagination?: Pagination;
  filters?: Filters;
}
