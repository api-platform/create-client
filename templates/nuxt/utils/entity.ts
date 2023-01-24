export function getIdFromIri(iri?: string) {
  if (!iri) return "";

  const id = iri.split("/").pop();

  return id;
}
