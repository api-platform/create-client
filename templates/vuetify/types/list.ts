export interface Filters {
  [key: string]: string;
}

export interface Order {
  [key: string]: "asc" | "desc";
}

export interface VuetifyOrder {
  key: string;
  order: string;
}

export interface ListParams {
  page: string;
  filters?: Filters;
  order?: Order;
}
