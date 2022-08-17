export interface PagedCollection<T> {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  "{{{hydraPrefix}}}member"?: T[];
  "{{{hydraPrefix}}}search"?: object;
  "{{{hydraPrefix}}}totalItems"?: number;
  "{{{hydraPrefix}}}view"?: {
    "@id": string;
    "@type": string;
    "{{{hydraPrefix}}}first"?: string;
    "{{{hydraPrefix}}}last"?: string;
    "{{{hydraPrefix}}}previous"?: string;
    "{{{hydraPrefix}}}next"?: string;
  };
}

export const isPagedCollection = <T>(data: any): data is PagedCollection<T> =>
  "{{{hydraPrefix}}}member" in data && Array.isArray(data["{{{hydraPrefix}}}member"])
