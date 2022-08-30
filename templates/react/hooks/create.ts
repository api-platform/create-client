import { useState } from "react";
import { ApiResource, TError } from "../utils/types";
import useFetch from "./fetch";

interface ICreateStore<Resource extends ApiResource> {
  error: TError;
  loading: boolean;
  created: Resource | null;
  reset: () => void;
  create: (values: Partial<Resource>) => Promise<void>;
}

const useCreate = <Resource extends ApiResource>(params: { "@id": string; }): ICreateStore<Resource> => {
  const {fetch} = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError>(null);
  const [created, setCreated] = useState<Resource | null>(null);

  return {
    error,
    loading,
    created,
    reset() {
      setLoading(false);
      setError(null);
    },
    create(values) {
      setLoading(true);

      return fetch(params["@id"], {method: "POST", body: JSON.stringify(values)})
        .then(({json}) => json)
        .then(retrieved => setCreated(retrieved))
        .catch(e => {
          setError(e);
        })
        .finally(() => setLoading(false));
    },
  };
}

export default useCreate;
