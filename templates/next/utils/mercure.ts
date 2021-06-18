import has from "lodash/has";
import { useEffect, useState } from "react";
import { PagedCollection } from "../types/Collection";
import { normalize } from "./dataAccess";

const mercureSubscribe = (hubURL: string, data: any | PagedCollection<any>, setData: (data: any) => void) => {
  const url = new URL(hubURL, window.origin);
  url.searchParams.append("topic", (new URL(data["@id"], window.origin)).toString());
  const eventSource = new EventSource(url.toString());
  eventSource.addEventListener("message", (event) => setData(normalize(JSON.parse(event.data))));

  return eventSource;
}

export const useMercure = (deps: any | PagedCollection<any>, hubURL: string) => {
  const [data, setData] = useState(deps);

  useEffect(() => {
    setData(deps);
  }, [deps]);

  if (!data) {
    return data;
  }

  if (!has(data, "{{{hydraPrefix}}}member") && !has(data, "@id")) {
    console.error("Object sent is not in JSON-LD format.");

    return data;
  }

  useEffect(() => {
    if (has(data, "{{{hydraPrefix}}}member") && Array.isArray(data["{{{hydraPrefix}}}member"]) && data["{{{hydraPrefix}}}member"].length !== 0) {
      // It's a PagedCollection
      data["{{{hydraPrefix}}}member"].forEach((obj, pos) => mercureSubscribe(hubURL, obj, (datum) => {
        data["{{{hydraPrefix}}}member"][pos] = datum;
        setData(data);
      }));

      return () => {
        eventSource.removeEventListener("message", setData);

        return data;
      };
    }

    // It's a single object
    const eventSource = mercureSubscribe(hubURL, data, setData);

    return () => {
      eventSource.removeEventListener("message", setData);

      return data;
    };
  }, [data]);

  return data;
}
