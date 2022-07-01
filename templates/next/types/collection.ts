import has from "lodash/has"

export interface PagedCollection<T> {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  "{{{hydraPrefix}}}firstPage"?: string;
  "{{{hydraPrefix}}}itemsPerPage"?: number;
  "{{{hydraPrefix}}}lastPage"?: string;
  "{{{hydraPrefix}}}member"?: T[];
  "{{{hydraPrefix}}}nextPage"?: string;
  "{{{hydraPrefix}}}search"?: object;
  "{{{hydraPrefix}}}totalItems"?: number;
}

export const isPagedCollection = <T>(data: any): data is PagedCollection<T> =>
  has(data, "{{{hydraPrefix}}}member") && Array.isArray(data["{{{hydraPrefix}}}member"])
