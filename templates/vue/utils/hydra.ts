import { get, has, mapValues } from "lodash";

interface HydraData {
  "{{hydraPrefix}}member": HydraData[];
}

export function normalize(data: HydraData) {
  if (has(data, "{{hydraPrefix}}member")) {
    // Normalize items in collections
    data["{{hydraPrefix}}member"] = data["{{hydraPrefix}}member"].map((item) => normalize(item));

    return data;
  }

  // Flatten nested documents
  return mapValues(data, (value) =>
    Array.isArray(value)
      ? value.map((v) => get(v, "@id", v))
      : get(value, "@id", value)
  );
}
