import { ENTRYPOINT } from "./config";
import type { Item } from "../types/item";

export const mercureSubscribe = (
  hubURL: URL,
  topics: string[],
  setData: <T extends Item>(data: T) => void
): EventSource => {
  const url = new URL(hubURL, ENTRYPOINT);

  topics.forEach((topic) =>
    url.searchParams.append("topic", new URL(topic, ENTRYPOINT).toString())
  );

  const eventSource = new EventSource(url.toString());

  eventSource.addEventListener("message", (event) => {
    setData(JSON.parse(event.data));
  });

  return eventSource;
};

export const extractHubURL = (response: Response): URL | undefined => {
  const linkHeader = response.headers.get("Link");
  if (!linkHeader) return undefined;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : undefined;
};
