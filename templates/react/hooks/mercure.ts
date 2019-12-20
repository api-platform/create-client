import { useCallback, useEffect, useState } from "react";
import { ENTRYPOINT } from "../config/entrypoint";
import { ApiResource } from "../utils/types";
import { PagedCollection } from "../interfaces/Collection";

interface IMercureStore<Resource extends ApiResource> {
  deleted: Resource | null;
  message: Resource | null;
  onResponse: (response: Response) => void;
}

const subscribe = (url: URL, topics: string[] | string): EventSource => {
  (Array.isArray(topics) ? topics : [topics]).forEach(
    topic => url.searchParams.append("topic", String(new URL(topic, ENTRYPOINT))),
  );

  return new EventSource(url.toString());
}

export const extractHubURL = (response: Response): URL | null => {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) {
    return null;
  }

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/,
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
}

const useMercure = <Resource extends ApiResource>(retrieved: Resource | null): IMercureStore<Resource> => {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [deleted, setDeleted] = useState<Resource | null>(null);
  const [message, setMessage] = useState<Resource | null>(null);
  const [hubURL, setHubURL] = useState<URL | null>(null);

  const onMessage = useCallback(
    (retrieved: Resource) => {
      if (1 === Object.keys(retrieved).length) {
        setDeleted(retrieved);
        return;
      }

      setMessage(retrieved);
    },
    [],
  );

  useEffect(() => {
    if (eventSource) {
      // Listen events
      eventSource.addEventListener(
        "message",
        event => onMessage(JSON.parse(event.data)),
      );
    }

    return () => {
      // Cleanup event source on unmount
      if (eventSource) {
        eventSource.close();
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSource]);

  useEffect(
    () => {
      const collection = retrieved as PagedCollection<Resource>;

      if (hubURL && retrieved) {
        if (collection["hydra:member"]) {
          setEventSource(subscribe(hubURL, collection["hydra:member"].map(item => item["@id"])));
        } else {
          setEventSource(subscribe(hubURL, retrieved["@id"]));
        }
      } else {
        setEventSource(null);
      }
    },
    [retrieved, hubURL],
  );

  return {
    deleted,
    message,
    onResponse (response: Response) {
      setHubURL(extractHubURL(response));
    },
  };
}

export default useMercure;
