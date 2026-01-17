import { useEffect, useState } from "react";
import ApiResource from "../types/ApiResource";
import { ENTRYPOINT } from "@/config/entrypoint";
import { extractHubURL, mercureSubscribe } from "../utils/mercure";

type useMercureType = {
    hubURL: Nullable<string>;
    eventSource: Nullable<EventSource>;
}

export const useMercure = <T extends ApiResource>(topics: string[], setData: (data: T) => void): useMercureType => {
    const [hubURL, setHubURL] = useState<Nullable<string>>(undefined);
    const [eventSource, setEventSource] = useState<Nullable<EventSource>>(undefined);
    if (topics.length < 1) return { hubURL, eventSource };

    useEffect(() => {
        fetch(`${ENTRYPOINT}${topics[0]}`)
            .then(res => {
                const extractedUrl = extractHubURL(res);
                if (extractedUrl) {
                    setHubURL(extractedUrl.href);
                }
            });

        if (hubURL) {
            setEventSource(mercureSubscribe<T>(new URL(hubURL), topics, setData));
        }

        return () => eventSource && eventSource.close();
    }, [hubURL, setData]);

    return { hubURL, eventSource };
}