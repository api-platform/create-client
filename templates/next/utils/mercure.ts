import { useEffect, useState } from "react";
import { PagedCollection, isPagedCollection } from "../types/collection";
import { isItem } from "../types/item";
import { normalize } from "./dataAccess";

const mercureSubscribe = <T>(hubURL: string, data: T | PagedCollection<T>, setData: (data: T) => void) => {
  const url = new URL(hubURL, window.origin);
  url.searchParams.append("topic", (new URL(data["@id"], window.origin)).toString());
  const eventSource = new EventSource(url.toString());
  eventSource.addEventListener("message", (event) => setData(normalize(JSON.parse(event.data))));

  return eventSource;
}

export const useMercure = <T>(deps: T | PagedCollection<T>, hubURL: string | null) => {
  const [data, setData] = useState(deps);

  useEffect(() => {
    setData(deps);
  }, [deps]);

  useEffect(() => {
    if (!hubURL || !data) {
      return;
    }

    if (!isPagedCollection(data) && !isItem(data)) {
      console.error("Object sent is not in JSON-LD format.");

      return;
    }

    if (isPagedCollection(data) && data["{{{hydraPrefix}}}member"].length !== 0) {
      const eventSources: EventSource[] = [];
      // It's a PagedCollection
      data["{{{hydraPrefix}}}member"].forEach((obj, pos) => {
        eventSources.push(mercureSubscribe(hubURL, obj, (datum: T) => {
          data["{{{hydraPrefix}}}member"][pos] = datum;
          setData({ ...data });
        }));
      });

      return () => {
        eventSources.forEach((eventSource) => eventSource.close());
      };
    }

    // It's a single object
    const eventSource = mercureSubscribe(hubURL, data, setData);

    return () => {
      eventSource.close();
    };
  }, [data]);

  return data;
}
