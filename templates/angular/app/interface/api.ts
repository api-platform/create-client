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
  "@id": string;
  "@type": string;
  "hydra:first": string;
  "hydra:previous": string;
  "hydra:last": string;
  "hydra:next": string;
}
