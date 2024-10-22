export interface Api {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
}

export interface ApiList {
  "hydra:totalItems": Number;
  "hydra:member": [];
  "hydra:view": Pagination;
  "hydra:search": {};
}

export interface ApiShow extends Api {
  [key: string]: string | undefined;
}

export interface ApiItem extends Api {
  [key: string]: string | undefined;
}

export interface Pagination {
  [key: string]: string;
}

export interface SubmissionErrors {
  [key: string]: string;
}
