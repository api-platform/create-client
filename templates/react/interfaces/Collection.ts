import { ApiResource } from "../utils/types";

export interface Pagination {
  "{{hydraPrefix}}first"?: string;
  "{{hydraPrefix}}previous"?: string;
  "{{hydraPrefix}}next"?: string;
  "{{hydraPrefix}}last"?: string;
}

export interface PagedCollection<T> extends ApiResource {
  "@context"?: string;
  "@type"?: string;
  "{{hydraPrefix}}firstPage"?: string;
  "{{hydraPrefix}}itemsPerPage"?: number;
  "{{hydraPrefix}}lastPage"?: string;
  "{{hydraPrefix}}member"?: T[];
  "{{hydraPrefix}}nextPage"?: string;
  "{{hydraPrefix}}search"?: object;
  "{{hydraPrefix}}totalItems"?: number;
  "{{hydraPrefix}}view"?: Pagination;
}
