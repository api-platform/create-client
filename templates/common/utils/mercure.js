import { ENTRYPOINT } from "../config/entrypoint";

export const mercureSubscribe = (hubURL, topics, setData) => {
  const url = new URL(hubURL, ENTRYPOINT);
  topics.forEach(topic =>
    url.searchParams.append("topic", (new URL(topic, ENTRYPOINT)).toString())
  );
  const eventSource = new EventSource(url.toString());
  eventSource.addEventListener("message", (event) => setData(JSON.parse(event.data)));

  return eventSource;
}

export const extractHubURL = (response) => {
  const linkHeader = response.headers.get('Link');
  if (!linkHeader) return null;

  const matches = linkHeader.match(
    /<([^>]+)>;\s+rel=(?:mercure|"[^"]*mercure[^"]*")/
  );

  return matches && matches[1] ? new URL(matches[1], ENTRYPOINT) : null;
}
