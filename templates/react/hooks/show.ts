import { useEffect, useState } from "react";
import { ApiResource, TError } from "../utils/types";
import { PagedCollection } from "../interfaces/Collection";
import useFetch from "./fetch";
import useMercure from "./mercure";

interface IShowStore<Resource extends ApiResource> {
  error: TError;
  loading: boolean;
  retrieved: Resource | null;
  retrieve: (id: string) => any;
  reset: (/*eventSource: EventSource | null*/) => any;
}

const useShow = <Resource extends ApiResource>(): IShowStore<Resource> => {
  const {fetch} = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError>(null);
  const [retrieved, setRetrieved] = useState<Resource | null>(null);
  const {deleted, message, onResponse} = useMercure<Resource>(retrieved);

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
      const collection = (retrieved as PagedCollection<Resource>);
      if (collection && collection['hydra:member']) {
        const item = collection['hydra:member'].find((i) => i["@id"] === message["@id"]);
        if (item && retrieved) {
          Object.assign(item, message);
          setRetrieved({ ...retrieved });
        }
        return;
      }
      setRetrieved(message);
    }
  }, [message, setRetrieved]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    error,
    loading,
    retrieved,
    reset () {
      setError(null);
      setLoading(false);
      setRetrieved(null);
    },
    retrieve (id) {
      setLoading(true);
      setError(null);

      return fetch(id)
        .then(subscribeMercure)
        .then((retrieved) => setRetrieved(retrieved))
        .catch(e => setError(e))
        .finally(() => setLoading(false));
    },
  };
}

export default useShow;
