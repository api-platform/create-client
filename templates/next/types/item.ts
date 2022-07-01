import has from "lodash/has"

export const isItem = <T>(data: any): data is T => has(data, "@id")
