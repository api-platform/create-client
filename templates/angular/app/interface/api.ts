export interface Api {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
}

export interface ApiList {
  "hydra:totalItems": Number;
  "hydra:member": [];
  "hydra:view": Pagination;
  "hydra:search": object;
}

export interface ApiShow extends Api {
  id: string | undefined;
  name: string | null;
}

export interface ApiItem extends Api {
  [key: string]: string | null | undefined;
}

export interface Pagination {
  [key: string]: string;
}

export interface SubmissionErrors {
  [key: string]: string;
}
