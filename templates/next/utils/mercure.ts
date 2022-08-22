import { useEffect, useState } from "react";
import { PagedCollection, isPagedCollection } from "../types/collection";
import { Item, isItem } from "../types/item";

const mercureSubscribe = <T extends Item | PagedCollection<Item> | undefined>(
  hubURL: string, data: T | PagedCollection<T>, setData: (data: T) => void
) => {
  if (!data || !data["@id"]) throw new Error('@id is missing');

  const url = new URL(hubURL, window.origin);
  url.searchParams.append("topic", (new URL(data["@id"], window.origin)).toString());
  const eventSource = new EventSource(url.toString());
  eventSource.addEventListener("message", (event) => setData(JSON.parse(event.data)));

  return eventSource;
}

export const useMercure = <TData extends Item | PagedCollection<Item> | undefined>(deps: TData, hubURL: string | null): TData => {
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

    if (isPagedCollection(data) && data["{{{hydraPrefix}}}member"] && data["{{{hydraPrefix}}}member"].length !== 0) {
      const eventSources: EventSource[] = [];
      // It's a PagedCollection
      data["{{{hydraPrefix}}}member"].forEach((obj, pos) => {
        eventSources.push(mercureSubscribe(hubURL, obj, (datum) => {
          if (data["{{{hydraPrefix}}}member"]) {
            data["{{{hydraPrefix}}}member"][pos] = datum;
          }
          setData({ ...data });
        }));
      });

      return () => {
        eventSources.forEach((eventSource) => eventSource.close());
      };
    }

    // It's a single object
    const eventSource = mercureSubscribe<TData>(hubURL, data, setData);

    return () => {
      eventSource.close();
    };
  }, [data]);

  return data;
}
