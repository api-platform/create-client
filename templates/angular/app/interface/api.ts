export interface Api {
  "@context"?: string,
  "@id"?: string,
  "@type"?: string,
}

export interface ApiList {
  "hydra:totalItems": Number,
  "hydra:member": [],
  "hydra:view": object,
  "hydra:search": object
}

export interface ApiShow extends Api {
  id: string | undefined,
  name: string | null
}

export interface ApiUpdate extends ApiShow {
  [key: string] : string | null | undefined
}


export interface ApiItem extends Api {
  [key: string] : string | null | undefined
}
