import { useEffect, useState } from "react";
import { ApiResource, TError } from "../utils/types";
import useFetch from "./fetch";
import useMercure from "./mercure";

interface IUpdateStore<Resource extends ApiResource> {
  error: TError;
  loading: boolean;
  updated: Resource | null;
  reset: () => any;
  update: (item: Resource, values: Partial<Resource>) => Promise<void>;
}

const useUpdate = <Resource extends ApiResource>(): IUpdateStore<Resource> => {
  const {fetch} = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError>(null);
  const [updated, setUpdated] = useState<Resource | null>(null);
  const {deleted, message, onResponse} = useMercure<Resource>(updated);

  const subscribeMercure = ({response, json}: {response: Response; json: any;}) => {
    onResponse(response);

    return json;
  };

  useEffect(() => {
    if (deleted) {
      setError(new Error(`${deleted["@id"]} has been deleted by another user.`));
    }
  }, [deleted]);

  useEffect(() => {
    if (message) {
      setUpdated(message);
    }
  }, [message]);

  return {
    loading,
    error,
    updated,
    reset() {
      setError(null);
      setLoading(false);
      setUpdated(null);
    },
    update (item: Resource, values: Partial<Resource>) {
      setError(null);
      setLoading(true);

      const options = {
        method: "PUT",
        headers: new Headers({"Content-Type": "application/ld+json"}),
        body: JSON.stringify(values),
      };

      return fetch(item["@id"], options)
        .then(subscribeMercure)
        .then((updated) => setUpdated(updated))
        .catch(e => {
          setError(e);
        })
        .finally(() => setLoading(false));
    },
  };
}

export default useUpdate;
