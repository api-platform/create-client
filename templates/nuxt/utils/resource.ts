export const getIdFromIri = (iri?: string): string => {
  if (!iri) return "";

  const id = iri.split("/").pop();

  if (!id) {
    return "";
  }

  return id;
}
