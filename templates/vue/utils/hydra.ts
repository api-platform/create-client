import { get, has, mapValues } from "lodash";

interface HydraData {
  "hydra:member": HydraData[];
}

export function normalize(data: HydraData) {
  if (has(data, "hydra:member")) {
    // Normalize items in collections
    data["hydra:member"] = data["hydra:member"].map((item) => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, (value) =>
    Array.isArray(value)
      ? value.map((v) => get(v, "@id", v))
      : get(value, "@id", value)
  );
}
