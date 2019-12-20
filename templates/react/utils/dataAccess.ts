export const normalizeLinks = (value: string | string[] | undefined): string[] => {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return value.split(",");
  }

  return value;
}
