import { useState } from "react";
import { ApiResource, TError } from "../utils/types";
import useFetch from "./fetch";

interface IDeleteStore<Resource extends ApiResource> {
  error: TError;
  loading: boolean;
  deleted: Resource | null;
  setDeleted: (item: Resource | null) => void;
  del: (item: Resource) => Promise<void>;
}

const useDelete = <Resource extends ApiResource>(): IDeleteStore<Resource> => {
  const {fetch} = useFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TError>(null);
  const [deleted, setDeleted] = useState<Resource | null>(null);

  return {
    loading,
    error,
    deleted,
    setDeleted,
    del(item: Resource) {
      setLoading(true);

      return fetch(item["@id"], {method: "DELETE"})
        .then(({json}) => json)
        .then(() => setDeleted(item))
        .catch(e => setError(e))
        .finally(() => setLoading(false));
    },
  };
}

export default useDelete;
